import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

/**
 * Area-manager data scope.
 *
 * The centralized super-admin schema links vendors to managers through
 * `Vendor.areaManagerId`, but old rows may only carry a city/pincode. These
 * helpers therefore combine the explicit assignment with the manager's
 * assigned regions so existing data is not hidden.
 */

export async function getManager(managerId: string) {
  const manager = await db.areaManager.findUnique({ where: { id: managerId } });
  if (!manager || manager.isDeleted === true) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Area manager account not found.",
    });
  }
  return manager;
}

/** Best-effort audit trail for area-manager actions. */
export async function logManagerAction(
  managerId: string,
  action: string,
  details: string,
) {
  try {
    await db.auditLog.create({
      data: { userId: managerId, action, details },
    });
  } catch (error) {
    console.error("areaManager audit log failed:", error);
  }
}

export function pincodesOf(manager: { assignedPincodes: string[] }) {
  return manager.assignedPincodes
    .map((value) => value.split(":")[1])
    .filter((value): value is string => Boolean(value));
}

export async function getScopedVendorIds(managerId: string) {
  const manager = await getManager(managerId);
  const cities = manager.assignedRegions;
  const pincodes = pincodesOf(manager);

  const or: any[] = [{ areaManagerId: managerId }];
  if (cities.length) {
    or.push({ addressCity: { in: cities } });
    or.push({ Store: { some: { address: { is: { city: { in: cities } } } } } });
  }
  if (pincodes.length) {
    or.push({
      Store: { some: { address: { is: { pincode: { in: pincodes } } } } },
    });
    or.push({ addressZipCode: { in: pincodes } });
  }

  const vendors = await db.vendor.findMany({
    where: { isDeleted: false, OR: or },
    select: { id: true },
  });

  return { manager, vendorIds: vendors.map((vendor) => vendor.id) };
}

export async function getScopedDeliveryPartners(managerId: string) {
  const manager = await getManager(managerId);
  const cities = manager.assignedRegions;
  const pincodes = pincodesOf(manager);

  if (!cities.length && !pincodes.length) {
    return { manager, partners: [] };
  }

  const or: any[] = [];
  if (cities.length) or.push({ address: { is: { city: { in: cities } } } });
  if (pincodes.length) {
    or.push({ address: { is: { pincode: { in: pincodes } } } });
  }

  const partners = await db.deliveryPartner.findMany({
    where: { isDeleted: false, OR: or },
    orderBy: { createdAt: "desc" },
  });

  return { manager, partners };
}

export async function getScopedLeads(managerId: string) {
  const manager = await getManager(managerId);
  const or: any[] = [{ assignedToId: managerId }];

  for (const city of manager.assignedRegions) {
    or.push({ address: { contains: city } });
  }

  return {
    manager,
    leads: await db.lead.findMany({
      where: { OR: or },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
  };
}

export async function getScopedSupportTickets(managerId: string) {
  const manager = await getManager(managerId);

  // Support tickets do not carry an area/pincode in the central schema.
  // Keep the whole support desk visible to area managers so nothing is
  // silently hidden; the UI shows the reporter and category.
  return {
    manager,
    tickets: await db.supportTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
    }),
  };
}
