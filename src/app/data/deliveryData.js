import { ORDERS } from "./ordersData";

/**
 * deliveryData.js
 * File: src/data/deliveryData.js
 *
 * Single source of truth for delivery partners.
 * Order counts are derived live from ordersData.js
 */

export const DELIVERY_STATUS = ["All", "Available", "Busy", "Inactive"];

export const VEHICLE_TYPES = ["Bicycle", "Motorbike", "E-Scooter", "Mini Truck"];

export const DELIVERY_PARTNERS = [
  {
    id: "D001",
    name: "Ravi Kumar",
    phone: "9700011111",
    altPhone: "9700022222",
    email: "ravi.kumar@add.in",
    address: "14, Vikas Nagar, Lucknow",
    area: "Gomti Nagar",
    vehicle: "Motorbike",
    vehicleNo: "UP32 AB 1234",
    status: "Busy",
    joinDate: "12 Jan 2024",
    rating: 4.8,
    totalDeliveries: 342,
    avatar: "RK",
    idProof: "Aadhar",
    emergencyContact: "9700033333",
  },
  {
    id: "D002",
    name: "Suresh Yadav",
    phone: "9700022222",
    altPhone: "",
    email: "suresh.y@add.in",
    address: "7, Indira Nagar, Block C, Lucknow",
    area: "Indira Nagar",
    vehicle: "Motorbike",
    vehicleNo: "UP32 CD 5678",
    status: "Available",
    joinDate: "3 Mar 2024",
    rating: 4.5,
    totalDeliveries: 218,
    avatar: "SY",
    idProof: "Driving License",
    emergencyContact: "9700044444",
  },
  {
    id: "D003",
    name: "Mohan Lal",
    phone: "9700033333",
    altPhone: "9700055555",
    email: "mohan.l@add.in",
    address: "22, Alambagh, Near Bus Stand, Lucknow",
    area: "Alambagh",
    vehicle: "Bicycle",
    vehicleNo: "N/A",
    status: "Available",
    joinDate: "20 Feb 2024",
    rating: 4.2,
    totalDeliveries: 156,
    avatar: "ML",
    idProof: "Aadhar",
    emergencyContact: "9700066666",
  },
  {
    id: "D004",
    name: "Deepak Singh",
    phone: "9700044444",
    altPhone: "",
    email: "deepak.s@add.in",
    address: "9, Aliganj, Sector 2, Lucknow",
    area: "Aliganj",
    vehicle: "E-Scooter",
    vehicleNo: "UP32 EF 9012",
    status: "Busy",
    joinDate: "5 Apr 2024",
    rating: 4.6,
    totalDeliveries: 189,
    avatar: "DS",
    idProof: "Voter ID",
    emergencyContact: "9700077777",
  },
  {
    id: "D005",
    name: "Ajay Tiwari",
    phone: "9700055555",
    altPhone: "9700088888",
    email: "ajay.t@add.in",
    address: "33, Hazratganj, Main Road, Lucknow",
    area: "Hazratganj",
    vehicle: "Motorbike",
    vehicleNo: "UP32 GH 3456",
    status: "Available",
    joinDate: "18 May 2024",
    rating: 4.9,
    totalDeliveries: 97,
    avatar: "AT",
    idProof: "Aadhar",
    emergencyContact: "9700099999",
  },
  {
    id: "D006",
    name: "Vikram Sharma",
    phone: "9700066666",
    altPhone: "",
    email: "vikram.s@add.in",
    address: "5, Chinhat, New Area, Lucknow",
    area: "Chinhat",
    vehicle: "Mini Truck",
    vehicleNo: "UP32 IJ 7890",
    status: "Inactive",
    joinDate: "1 Jun 2024",
    rating: 3.9,
    totalDeliveries: 64,
    avatar: "VS",
    idProof: "Driving License",
    emergencyContact: "9700010101",
  },
];

/**
 * getDeliveryStats(partnerId)
 * Returns live order stats for a delivery partner from ordersData.
 */
export function getDeliveryStats(partnerId) {
  const partnerOrders = ORDERS.filter(o => o.delivery.id === partnerId);
  return {
    total:     partnerOrders.length,
    delivered: partnerOrders.filter(o => o.status === "Delivered").length,
    pending:   partnerOrders.filter(o => o.status === "Processing").length,
    cancelled: partnerOrders.filter(o => o.status === "Cancelled").length,
    revenue:   partnerOrders
      .filter(o => o.status === "Delivered")
      .reduce((s, o) => s + o.finalAmount, 0),
    orders: partnerOrders,
  };
}
