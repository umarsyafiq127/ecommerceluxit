
import React, { useState, useEffect } from "react";
import { ShoppingBag, CheckCircle, MapPin, Calendar } from "lucide-react";
import { getRecentOrders } from "../services/OrderService";
import { RecentOrder } from "../types/Order";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const RecentOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        const recentOrders = await getRecentOrders();
        setOrders(recentOrders);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
        toast({
          title: "Error",
          description: "Failed to load recent orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="text-center mb-12">
        <h1 className="heading-primary mb-4">Recent Orders</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See what other customers have recently purchased from our store.
          Join them and experience our amazing products!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-islamic-gold/20 border-t-islamic-gold rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No recent orders yet</h3>
              <p className="mt-2 text-gray-500">Be the first to place an order!</p>
              <Button asChild className="mt-4 bg-islamic-green hover:bg-islamic-green/90">
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className="h-2 bg-islamic-green"></div>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{order.customerName}</CardTitle>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <ShoppingBag className="h-5 w-5 text-islamic-gold mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Ordered:</p>
                        <p className="text-gray-600">{order.productNames.join(", ")}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-islamic-teal mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Location:</p>
                        <p className="text-gray-600">{order.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-islamic-green mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Payment Method:</p>
                        <p className="text-gray-600">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Place Your Order?</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Browse our collection and find the perfect products for your needs.
          Join our happy customers today!
        </p>
        <Button asChild className="bg-islamic-green hover:bg-islamic-green/90">
          <Link to="/products">Shop Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default RecentOrdersPage;
