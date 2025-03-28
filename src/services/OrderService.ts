
import { RecentOrder } from "../types/Order";
import { v4 as uuidv4 } from 'uuid';

// Mock storage for recent orders
let recentOrders: RecentOrder[] = [
  {
    id: "1",
    customerName: "Ahmad Rizki",
    productNames: ["Sajadah Premium Handmade", "Air Zam-zam Asli 1L"],
    location: "Jakarta",
    paymentMethod: "Transfer Bank",
    orderDate: new Date("2023-05-15")
  },
  {
    id: "2",
    customerName: "Siti Aminah",
    productNames: ["Kurma Ajwa Premium 1kg"],
    location: "Bandung",
    paymentMethod: "COD",
    orderDate: new Date("2023-05-16")
  },
  {
    id: "3",
    customerName: "Budi Santoso",
    productNames: ["Paket Parfum Attar Arabian", "Sajadah Premium Handmade"],
    location: "Surabaya",
    paymentMethod: "Transfer Bank",
    orderDate: new Date("2023-05-17")
  }
];

// Get all recent orders
export const getRecentOrders = async (): Promise<RecentOrder[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return orders sorted by date (newest first)
  return [...recentOrders].sort((a, b) => 
    b.orderDate.getTime() - a.orderDate.getTime()
  );
};

// Add a new order
export const addOrder = async (
  customerName: string,
  productNames: string[],
  location: string,
  paymentMethod: string
): Promise<RecentOrder> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newOrder: RecentOrder = {
    id: uuidv4(),
    customerName,
    productNames,
    location,
    paymentMethod,
    orderDate: new Date()
  };
  
  recentOrders.push(newOrder);
  return newOrder;
};
