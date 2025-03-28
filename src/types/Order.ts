
export interface RecentOrder {
  id: string;
  customerName: string;
  productNames: string[];
  location: string;
  paymentMethod: string;
  orderDate: Date;
}
