
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getRecentOrders, EnhancedRecentOrder } from "../services/OrderService";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RecentOrdersPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<EnhancedRecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const recentOrders = await getRecentOrders();
        setOrders(recentOrders);
      } catch (error) {
        console.error("Failed to fetch recent orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-start justify-center">
        <div className="w-16 h-16 border-4 border-islamic-gold/20 border-t-islamic-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-6">
        <Link
          to="/admin"
          className="inline-flex items-center text-islamic-teal mb-4 hover:text-islamic-green transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="heading-primary mb-4">Recent Orders</h1>
        <p className="text-gray-600 max-w-2xl">
          A list of recent orders placed by customers.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Payment Method</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            // Format date and time
            const orderDate = new Date(order.timeCreated || order.orderDate);
            const formattedDate = orderDate.toLocaleDateString();
            const formattedTime = orderDate.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            });

            return (
              <TableRow key={order.id}>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {order.productNames.map((product, idx) => (
                      <li key={idx}>{product}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  {formattedDate}
                  <br />
                  <span className="text-xs text-gray-500">{formattedTime}</span>
                </TableCell>
                <TableCell>{order.location}</TableCell>
                <TableCell>
                  <span className={
                    order.paymentMethod === "WhatsApp" 
                      ? "text-green-600 font-medium" 
                      : ""
                  }>
                    {order.paymentMethod}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentOrdersPage;
