
import { RecentOrder } from "../types/Order";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";

// Update the RecentOrder type to include timestamp
export interface EnhancedRecentOrder extends RecentOrder {
  timeCreated: string; // Timestamp in ISO format for displaying time
}

// Mock storage for recent orders
let recentOrders: EnhancedRecentOrder[] = [
  {
    id: "1",
    customerName: "Ahmad Rizki",
    productNames: ["Sajadah Premium Handmade", "Air Zam-zam Asli 1L"],
    location: "Jakarta",
    paymentMethod: "Transfer Bank",
    orderDate: new Date("2023-05-15"),
    timeCreated: new Date("2023-05-15T14:30:45").toISOString()
  },
  {
    id: "2",
    customerName: "Siti Aminah",
    productNames: ["Kurma Ajwa Premium 1kg"],
    location: "Bandung",
    paymentMethod: "COD",
    orderDate: new Date("2023-05-16"),
    timeCreated: new Date("2023-05-16T09:15:22").toISOString()
  },
  {
    id: "3",
    customerName: "Budi Santoso",
    productNames: ["Paket Parfum Attar Arabian", "Sajadah Premium Handmade"],
    location: "Surabaya",
    paymentMethod: "Transfer Bank",
    orderDate: new Date("2023-05-17"),
    timeCreated: new Date("2023-05-17T16:45:33").toISOString()
  }
];

// Get all recent orders
export const getRecentOrders = async (): Promise<EnhancedRecentOrder[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return orders sorted by date (newest first)
  return [...recentOrders].sort((a, b) => 
    new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime()
  );
};

// Add a new order
export const addOrder = async (
  customerName: string,
  productNames: string[],
  location: string,
  paymentMethod: string
): Promise<EnhancedRecentOrder> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date();
  
  const newOrder: EnhancedRecentOrder = {
    id: uuidv4(),
    customerName,
    productNames,
    location,
    paymentMethod,
    orderDate: now,
    timeCreated: now.toISOString()
  };
  
  recentOrders.push(newOrder);
  
  toast({
    title: "Order Added",
    description: `New order from ${customerName} has been recorded`,
  });
  
  return newOrder;
};

// Add a WhatsApp order
export const addWhatsAppOrder = async (
  customerName: string,
  productNames: string[],
  location: string
): Promise<EnhancedRecentOrder> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date();
  
  const newOrder: EnhancedRecentOrder = {
    id: uuidv4(),
    customerName,
    productNames,
    location,
    paymentMethod: "WhatsApp",
    orderDate: now,
    timeCreated: now.toISOString()
  };
  
  recentOrders.push(newOrder);
  
  toast({
    title: "WhatsApp Order Sent",
    description: `WhatsApp order from ${customerName} has been recorded`,
  });
  
  return newOrder;
};
