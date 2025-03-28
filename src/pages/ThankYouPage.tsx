
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ThankYouPage: React.FC = () => {
  const { clearCart } = useCart();

  // Clear cart when thank you page is loaded
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-islamic-green/20 flex items-center justify-center mb-6">
        <Check className="h-10 w-10 text-islamic-green" strokeWidth={3} />
      </div>
      
      <h1 className="heading-primary text-center mb-4">Thank You for Your Order!</h1>
      
      <p className="text-gray-600 text-center mb-8 max-w-lg">
        Your order has been successfully placed. Please check your WhatsApp for further instructions to complete the payment.
      </p>
      
      <Card className="w-full max-w-md mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-islamic-cream flex items-center justify-center mt-0.5">
                <span className="text-islamic-navy font-medium text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium">Check WhatsApp</h3>
                <p className="text-sm text-gray-500">
                  A message has been sent to your WhatsApp with payment instructions
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-islamic-cream flex items-center justify-center mt-0.5">
                <span className="text-islamic-navy font-medium text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium">Make Your Payment</h3>
                <p className="text-sm text-gray-500">
                  Complete your payment by following the instructions
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-islamic-cream flex items-center justify-center mt-0.5">
                <span className="text-islamic-navy font-medium text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium">Order Processing</h3>
                <p className="text-sm text-gray-500">
                  Your order will be processed once payment is confirmed
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/recent-orders">
          <Button variant="outline" className="flex items-center space-x-2">
            <span>View Recent Orders</span>
          </Button>
        </Link>
        
        <Link to="/products">
          <Button className="bg-islamic-green hover:bg-islamic-green/90 flex items-center space-x-2">
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
