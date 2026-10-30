import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  getManager,
  getScopedDeliveryPartners,
  getScopedLeads,
  getScopedSupportTickets,
  getScopedVendorIds,
  logManagerAction,
} from "~/server/api/areaManagerScope";
import {
  mapAuditLog,
  mapDeliveryPartner,
  mapLead,
  mapOrder,
  mapSupportTicket,
  mapVendor,
  ticketStatusToDb,
} from "~/server/api/areaManagerMappers";

const managerIdOf = (session: any) => {
  const id = session?.user?.id;
  if (!id) throw new TRPCError({ code: "UNAUTHORIZED" });
  return id as string;
};

const orderInclude = {
  customer: true,
  vendor: true,
  items: true,
  address: true,
  deliveryStatus: { include: { assignedTo: true } },
  statusHistory: true,
} as const;

async function ordersForManager(managerId: string) {
  const { vendorIds } = await getScopedVendorIds(managerId);
  return db.order.findMany({
    where: { OR: [{ areaManagerId: managerId }, { vendorId: { in: vendorIds } }] },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
    take: 500,
  });
}

export const areaManagerDataRouter = createTRPCRouter({
  dashboard: createTRPCRouter({
    overview: protectedProcedure.query(async ({ ctx }) => {
      const managerId = managerIdOf(ctx.session);
      const { manager, vendorIds } = await getScopedVendorIds(managerId);

      const orders = await db.order.findMany({
        where: { OR: [{ areaManagerId: managerId }, { vendorId: { in: vendorIds } }] },
        include: orderInclude,
        orderBy: { createdAt: "desc" },
        take: 500,
      });

      const mapped = orders.map(mapOrder);
      const active = mapped.filter((order) => order.status !== "Cancelled");
      const revenue = active.reduce((sum, order) => sum + order.finalAmount, 0);

      const stats = {
        total: mapped.length,
        revenue,
        pending: mapped.filter((order) => order.status === "Pending").length,
        processing: mapped.filter((order) => order.status === "Processing").length,
        delivered: mapped.filter((order) => order.status === "Delivered").length,
        cancelled: mapped.filter((order) => order.status === "Cancelled").length,
        unassignedVendor: 0,
        unassignedDelivery: mapped.filter(
          (order) => !order.delivery.id && order.status !== "Delivered" && order.status !== "Cancelled",
        ).length,
      };

      const days = [];
      for (let index = 6; index >= 0; index--) {
        const date = new Date();
        date.setDate(date.getDate() - index);
        const key = date.toDateString();
        const dayOrders = mapped.filter(
          (order) => new Date(order.createdAt).toDateString() === key,
        );
        days.push({
          day: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          Orders: dayOrders.length,
          Delivered: dayOrders.filter((order) => order.status === "Delivered").length,
          Revenue: dayOrders.reduce((sum, order) => sum + order.finalAmount, 0),
          Pending: dayOrders.filter((order) => order.status === "Pending").length,
        });
      }

      const alerts = [];
      const noDelivery = mapped.filter(
        (order) => !order.delivery.id && order.status === "Processing",
      );
      if (noDelivery.length) {
        alerts.push({
          id: "delivery-unassigned",
          type: "warning",
          title: `${noDelivery.length} order${noDelivery.length > 1 ? "s" : ""} need delivery boy`,
          desc: noDelivery.map((order) => order.id).join(", "),
          action: "Assign Now",
          link: "/orders",
        });
      }
      const cancelled = mapped.filter((order) => order.status === "Cancelled");
      if (cancelled.length) {
        alerts.push({
          id: "cancelled",
          type: "danger",
          title: `${cancelled.length} cancelled order${cancelled.length > 1 ? "s" : ""}`,
          desc: cancelled.map((order) => order.id).join(", "),
          action: "Review",
          link: "/orders",
        });
      }

      return {
        manager: {
          id: manager.id,
          name: manager.fullName,
          email: manager.email,
          mobile: manager.phoneNumber,
          regions: manager.assignedRegions,
        },
        stats,
        chart: days,
        alerts,
        recentOrders: mapped.slice(0, 8),
      };
    }),
  }),

  orders: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const managerId = managerIdOf(ctx.session);
      return (await ordersForManager(managerId)).map(mapOrder);
    }),

    byId: protectedProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const order = (await ordersForManager(managerId)).find(
          (row) => row.id === input.id || row.orderId === input.id,
        );
        if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
        return mapOrder(order);
      }),

    trip: protectedProcedure
      .input(z.object({ orderId: z.string().min(1) }))
      .query(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const order = (await ordersForManager(managerId)).find(
          (row) => row.id === input.orderId || row.orderId === input.orderId,
        );
        if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });

        const trip = await db.trip.findFirst({ where: { order: order.id } });
        if (!trip) return null;

        return {
          id: trip.id,
          tripId: trip.tripId,
          status: trip.status,
          pickup: trip.pickupLocation,
          delivery: trip.deliveryLocation,
          current: trip.currentLocation,
          routePath: trip.routePath,
          assignedAt: trip.assignedAt,
          acceptedAt: trip.acceptedAt,
          pickupStartedAt: trip.pickupStartedAt,
          pickedUpAt: trip.pickedUpAt,
          deliveryStartedAt: trip.deliveryStartedAt,
          deliveredAt: trip.deliveredAt,
          cancelledAt: trip.cancelledAt,
          estimatedDistanceKm: trip.estimatedDistanceKm,
          actualDistanceKm: trip.actualDistanceKm,
          estimatedDurationMin: trip.estimatedDurationMin,
          actualDurationMin: trip.actualDurationMin,
        };
      }),

    updateStatus: protectedProcedure
      .input(z.object({ id: z.string().min(1), status: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const order = (await ordersForManager(managerId)).find(
          (row) => row.id === input.id || row.orderId === input.id,
        );
        if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });

        const updated = await db.order.update({
          where: { id: order.id },
          data: {
            orderStatus: input.status as any,
            statusHistory: {
              create: {
                status: input.status,
                timestamp: new Date(),
                remarks: "Updated from area manager panel",
                updatedById: managerId,
                updatedByRole: "System",
              },
            },
          },
          include: orderInclude,
        });

        await logManagerAction(
          managerId,
          "ORDER_STATUS_UPDATED",
          `${updated.orderId} → ${input.status}`,
        );

        return mapOrder(updated);
      }),

    assignDelivery: protectedProcedure
      .input(z.object({ id: z.string().min(1), partnerId: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const order = (await ordersForManager(managerId)).find(
          (row) => row.id === input.id || row.orderId === input.id,
        );
        if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });

        const { partners } = await getScopedDeliveryPartners(managerId);
        const partner = partners.find((row) => row.id === input.partnerId);
        if (!partner) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Delivery partner not found." });
        }

        await db.deliveryStatus.create({
          data: {
            orderId: order.id,
            assignedToId: partner.id,
            status: "assigned",
          },
        });

        await logManagerAction(
          managerId,
          "DELIVERY_ASSIGNED",
          `${order.orderId} → ${partner.name}`,
        );

        const updated = await db.order.findUniqueOrThrow({
          where: { id: order.id },
          include: orderInclude,
        });
        return mapOrder(updated);
      }),
  }),

  vendors: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const managerId = managerIdOf(ctx.session);
      const { vendorIds } = await getScopedVendorIds(managerId);

      const [vendors, orders, config] = await Promise.all([
        db.vendor.findMany({
          where: { id: { in: vendorIds }, isDeleted: false },
          include: { Store: true },
          orderBy: { createdAt: "desc" },
        }),
        db.order.findMany({
          where: { vendorId: { in: vendorIds }, isCancelled: false },
          select: { vendorId: true, grandTotal: true, createdAt: true },
        }),
        db.platformConfig.findFirst(),
      ]);

      const commissionPct = Math.round((config?.vendorMargin ?? 0.1) * 100);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);

      return vendors.map((vendor) => {
        const vendorOrders = orders.filter((order) => order.vendorId === vendor.id);
        const revenue = vendorOrders.reduce(
          (sum, order) => sum + (order.grandTotal ?? 0),
          0,
        );
        return mapVendor(
          vendor,
          {
            totalOrders: vendorOrders.length,
            ordersThisWeek: vendorOrders.filter(
              (order) => new Date(order.createdAt) >= weekStart,
            ).length,
            revenue,
          },
          commissionPct,
        );
      });
    }),

    byId: protectedProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const { vendorIds } = await getScopedVendorIds(managerId);
        if (!vendorIds.includes(input.id)) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Vendor not found." });
        }
        const vendor = await db.vendor.findUnique({
          where: { id: input.id },
          include: { Store: true, documents: true },
        });
        if (!vendor) throw new TRPCError({ code: "NOT_FOUND" });
        return mapVendor(vendor, { totalOrders: 0, ordersThisWeek: 0, revenue: 0 }, 10);
      }),

    setActive: protectedProcedure
      .input(z.object({ id: z.string().min(1), active: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const { vendorIds } = await getScopedVendorIds(managerId);
        if (!vendorIds.includes(input.id)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Vendor is outside your area." });
        }
        return db.vendor.update({
          where: { id: input.id },
          data: { isActive: input.active },
          select: { id: true, isActive: true },
        }).then(async (updated) => {
          await logManagerAction(
            managerId,
            input.active ? "VENDOR_ACTIVATED" : "VENDOR_DEACTIVATED",
            input.id,
          );
          return updated;
        });
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(160),
          phone: z.string().trim().min(10).max(15),
          email: z.string().trim().email().optional().or(z.literal("")),
          area: z.string().trim().min(1),
          address: z.string().trim().min(1),
          category: z.string().trim().min(1),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const manager = await getManager(managerId);
        const role = await db.role.findFirst({ where: { name: "vendor" } });
        if (!role) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Vendor role is not seeded.",
          });
        }

        const email =
          input.email?.trim() ||
          `vendor.${managerId.slice(-6)}.${Date.now()}@areamanager.local`;

        const vendor = await db.vendor.create({
          data: {
            name: input.name,
            mobile: input.phone,
            email,
            password: null,
            gender: "other",
            vendorType: "retailer_product",
            onboardingStatus: "profile_created",
            agreementCheck: true,
            addressStreet: input.address,
            addressCity: input.area,
            businessCategory: [input.category],
            businessType: input.category,
            areaManagerId: managerId,
            roleId: role.id,
            isApproved: false,
            isActive: true,
            isVerified: { email: false, mobile: false },
          },
          select: { id: true, name: true },
        });

        await logManagerAction(
          managerId,
          "VENDOR_CREATED",
          `${vendor.name} · ${input.area}`,
        );

        return vendor;
      }),
  }),

  leads: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const managerId = managerIdOf(ctx.session);
      const { manager, leads } = await getScopedLeads(managerId);
      const area = manager.assignedRegions[0] ?? "—";
      return leads.map((lead) => mapLead(lead, area));
    }),

    updateStage: protectedProcedure
      .input(z.object({ id: z.string().min(1), status: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const { leads } = await getScopedLeads(managerId);
        if (!leads.some((lead) => lead.id === input.id)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Lead is outside your area." });
        }
        const updated = await db.lead.update({
          where: { id: input.id },
          data: { status: input.status as any },
          select: { id: true, status: true },
        });
        await logManagerAction(
          managerId,
          "LEAD_STAGE_UPDATED",
          `${updated.id} → ${updated.status}`,
        );
        return updated;
      }),
  }),

  delivery: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const managerId = managerIdOf(ctx.session);
      const { partners } = await getScopedDeliveryPartners(managerId);
      const partnerIds = partners.map((partner) => partner.id);

      const statuses = await db.deliveryStatus.findMany({
        where: { assignedToId: { in: partnerIds } },
        select: { assignedToId: true, status: true, orderId: true },
      });
      const orderIds = [...new Set(statuses.map((row) => row.orderId))];
      const orders = await db.order.findMany({
        where: { id: { in: orderIds } },
        select: { id: true, grandTotal: true },
      });
      const orderTotals = new Map(
        orders.map((order) => [order.id, order.grandTotal ?? 0]),
      );

      return partners.map((partner) => {
        const partnerStatuses = statuses.filter(
          (row) => row.assignedToId === partner.id,
        );
        const delivered = partnerStatuses.filter(
          (row) => row.status === "delivered",
        ).length;
        const pending = partnerStatuses.filter(
          (row) => row.status !== "delivered" && row.status !== "cancelled",
        ).length;
        const revenue = partnerStatuses.reduce(
          (sum, row) => sum + (orderTotals.get(row.orderId) ?? 0),
          0,
        );

        return {
          ...mapDeliveryPartner(partner, { delivered, pending, revenue }),
          stats: { delivered, pending, revenue },
        };
      });
    }),

    setActive: protectedProcedure
      .input(z.object({ id: z.string().min(1), active: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const { partners } = await getScopedDeliveryPartners(managerId);
        if (!partners.some((partner) => partner.id === input.id)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Partner is outside your area." });
        }
        return db.deliveryPartner.update({
          where: { id: input.id },
          data: { isActive: input.active },
          select: { id: true, isActive: true },
        }).then(async (updated) => {
          await logManagerAction(
            managerId,
            input.active ? "DELIVERY_PARTNER_ACTIVATED" : "DELIVERY_PARTNER_DEACTIVATED",
            input.id,
          );
          return updated;
        });
      }),
  }),

  complaints: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const managerId = managerIdOf(ctx.session);
      const { manager, tickets } = await getScopedSupportTickets(managerId);
      const ticketIds = tickets.map((ticket) => ticket.id);
      const messages = await db.supportMessage.findMany({
        where: { ticketId: { in: ticketIds } },
        orderBy: { createdAt: "asc" },
      });
      const byTicket = new Map<string, any[]>();
      for (const message of messages) {
        const list = byTicket.get(message.ticketId) ?? [];
        list.push(message);
        byTicket.set(message.ticketId, list);
      }
      const area = manager.assignedRegions[0] ?? "—";
      return tickets.map((ticket) => {
        const ticketMessages = byTicket.get(ticket.id) ?? [];
        return mapSupportTicket(ticket, area, ticketMessages.length, ticketMessages);
      });
    }),

    messages: protectedProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(async ({ input }) => {
        const messages = await db.supportMessage.findMany({
          where: { ticketId: input.id },
          orderBy: { createdAt: "asc" },
        });
        return messages.map((message) => ({
          id: message.id,
          senderRole: message.senderRole,
          senderName: message.senderName,
          message: message.message,
          createdAt: message.createdAt,
        }));
      }),

    reply: protectedProcedure
      .input(z.object({ id: z.string().min(1), message: z.string().trim().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const manager = await getManager(managerId);
        const message = await db.supportMessage.create({
          data: {
            ticketId: input.id,
            senderRole: "support",
            senderName: manager.fullName,
            message: input.message,
          },
        });
        await db.supportTicket.update({
          where: { id: input.id },
          data: { status: "in_progress" },
        });
        await logManagerAction(
          managerId,
          "COMPLAINT_REPLIED",
          `${input.id}`,
        );
        return message;
      }),

    setStatus: protectedProcedure
      .input(z.object({ id: z.string().min(1), status: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const updated = await db.supportTicket.update({
          where: { id: input.id },
          data: { status: ticketStatusToDb(input.status) },
          select: { id: true, status: true },
        });
        await logManagerAction(
          managerId,
          "COMPLAINT_STATUS_UPDATED",
          `${updated.id} → ${updated.status}`,
        );
        return updated;
      }),
  }),

  earnings: createTRPCRouter({
    summary: protectedProcedure.query(async ({ ctx }) => {
      const managerId = managerIdOf(ctx.session);
      const { vendorIds } = await getScopedVendorIds(managerId);
      const [orders, config] = await Promise.all([
        db.order.findMany({
          where: { OR: [{ areaManagerId: managerId }, { vendorId: { in: vendorIds } }], isCancelled: false },
          include: orderInclude,
          orderBy: { createdAt: "desc" },
          take: 500,
        }),
        db.platformConfig.findFirst(),
      ]);
      const commissionPct = Math.round((config?.vendorMargin ?? 0.1) * 100);
      const mapped = orders.map(mapOrder);
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);

      const orderEarnings = mapped.map((order) => ({
        orderId: order.id,
        date: order.date,
        time: order.time,
        customer: order.customer.name,
        area: order.area,
        vendorName: order.vendor.name,
        commPct: commissionPct,
        orderAmt: order.finalAmount,
        earned: Math.round((order.finalAmount * commissionPct) / 100),
        status: order.status,
        createdAt: order.createdAt,
      }));

      const totalLifetime = orderEarnings.reduce((sum, row) => sum + row.earned, 0);
      const thisMonth = orderEarnings
        .filter((row) => new Date(row.createdAt) >= monthStart)
        .reduce((sum, row) => sum + row.earned, 0);
      const thisWeek = orderEarnings
        .filter((row) => new Date(row.createdAt) >= weekStart)
        .reduce((sum, row) => sum + row.earned, 0);

      const vendorMap = new Map<string, any>();
      for (const row of orderEarnings) {
        const current = vendorMap.get(row.vendorName) ?? {
          vendorName: row.vendorName,
          commPct: row.commPct,
          orders: 0,
          orderAmt: 0,
          earned: 0,
        };
        current.orders += 1;
        current.orderAmt += row.orderAmt;
        current.earned += row.earned;
        vendorMap.set(row.vendorName, current);
      }

      return {
        orderEarnings,
        summary: {
          totalLifetime,
          totalPaidOut: 0,
          pendingPayout: 0,
          availableBalance: totalLifetime,
          thisMonthEarnings: thisMonth,
          thisWeekEarnings: thisWeek,
          vendorBreakdown: [...vendorMap.values()].sort(
            (a, b) => b.earned - a.earned,
          ),
          orderCount: orderEarnings.length,
        },
        payouts: [],
        commissionPct,
      };
    }),
  }),

  activity: createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
      const managerId = managerIdOf(ctx.session);
      const manager = await getManager(managerId);
      const logs = await db.auditLog.findMany({
        where: { userId: managerId },
        orderBy: { createdAt: "desc" },
        take: 300,
      });
      return logs.map((log) => mapAuditLog(log, manager.fullName));
    }),

    clear: protectedProcedure.mutation(async ({ ctx }) => {
      const managerId = managerIdOf(ctx.session);
      await db.auditLog.deleteMany({ where: { userId: managerId } });
      return { ok: true };
    }),
  }),

  badges: protectedProcedure.query(async ({ ctx }) => {
    const managerId = managerIdOf(ctx.session);
    const { vendorIds } = await getScopedVendorIds(managerId);
    const { leads } = await getScopedLeads(managerId);
    const [orders, complaints] = await Promise.all([
      db.order.count({
        where: {
          OR: [{ areaManagerId: managerId }, { vendorId: { in: vendorIds } }],
          orderStatus: { in: ["created", "confirmed", "preparing", "ready"] },
        },
      }),
      db.supportTicket.count({ where: { status: { in: ["open", "in_progress"] } } }),
    ]);
    return {
      orders,
      leads: leads.filter((lead) => lead.status === "new").length,
      complaints,
    };
  }),

  profile: createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
      const manager = await getManager(managerIdOf(ctx.session));
      return {
        id: manager.id,
        name: manager.fullName,
        email: manager.email,
        phone: manager.phoneNumber,
        employeeCode: manager.employeeCode,
        regions: manager.assignedRegions,
        areaIds: manager.assignedAreaIds,
        pincodes: manager.assignedPincodes,
        isActive: manager.isActive,
        isApproved: manager.isApproved,
      };
    }),

    update: protectedProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(120),
          email: z.string().trim().email(),
          phone: z.string().trim().min(10).max(15),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const managerId = managerIdOf(ctx.session);
        const updated = await db.areaManager.update({
          where: { id: managerId },
          data: {
            fullName: input.name,
            email: input.email,
            phoneNumber: input.phone,
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        });
        await logManagerAction(managerId, "PROFILE_UPDATED", input.email);
        return {
          id: updated.id,
          name: updated.fullName,
          email: updated.email,
          phone: updated.phoneNumber,
        };
      }),
  }),
});
