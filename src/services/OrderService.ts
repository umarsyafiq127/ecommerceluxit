
import { RecentOrder } from "../types/Order";

// Mock storage for recent orders
let mockRecentOrders: RecentOrder[] = [
  {
    id: "1",
    customerName: "Ahmad Rizki",
    productNames: ["Sajadah Premium Handmade", "Kurma Ajwa Premium 1kg"],
    location: "Jakarta",
    paymentMethod: "Transfer",
    orderDate: new Date("2023-06-10")
  },
  {
    id: "2",
    customerName: "Siti Aisyah",
    productNames: ["Air Zam-zam Asli 1L"],
    location: "Surabaya",
    paymentMethod: "COD",
    orderDate: new Date("2023-06-12")
  },
  {
    id: "3",
    customerName: "Muhammad Faisal",
    productNames: ["Paket Parfum Attar Arabian", "Jilbab Elegant - Hijau Zamrud"],
    location: "Bandung",
    paymentMethod: "Transfer",
    orderDate: new Date("2023-06-15")
  }
];

// Get recent orders
export const getRecentOrders = async (): Promise<RecentOrder[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a copy of the orders sorted by date (newest first)
  return [...mockRecentOrders].sort((a, b) => 
    b.orderDate.getTime() - a.orderDate.getTime()
  );
};

// Add a new order
export const addOrder = async (order: Omit<RecentOrder, "id" | "orderDate">): Promise<RecentOrder> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newOrder: RecentOrder = {
    id: String(mockRecentOrders.length + 1),
    ...order,
    orderDate: new Date()
  };
  
  mockRecentOrders.push(newOrder);
  
  return newOrder;
};
