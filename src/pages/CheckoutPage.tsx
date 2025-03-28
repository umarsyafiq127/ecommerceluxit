
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { addOrder } from "../services/OrderService";
import { ArrowLeft, ShoppingCart, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, calculateTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16 text-center">
        <h1 className="heading-primary mb-6">Checkout</h1>
        <p className="text-gray-600 mb-8">Your cart is empty. Add some products before checking out.</p>
        <Link to="/products">
          <Button className="bg-islamic-teal hover:bg-islamic-teal/90">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !province || !city || !postalCode || !address || !paymentMethod) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to complete your order",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create order details
      const productNames = cart.map(item => item.product.name);
      const location = `${city}, ${province}`;
      
      // Save order to recent orders
      await addOrder(name, productNames, location, paymentMethod);
      
      // Format WhatsApp message
      const cartDetails = cart.map(item => 
        `- ${item.product.name} (${item.quantity}x) - $${(item.product.price * item.quantity).toFixed(2)}`
      ).join('\n');
      
      const orderMessage = `
*NEW ORDER*
------------------
*Customer Information:*
Name: ${name}
Phone: ${phone}
Address: ${address}
City: ${city}
Province: ${province}
Postal Code: ${postalCode}

*Order Details:*
${cartDetails}

*Total: $${calculateTotal().toFixed(2)}*
*Payment Method: ${paymentMethod}*
------------------
`;
      
      // Encode the message for WhatsApp
      const encodedMessage = encodeURIComponent(orderMessage);
      const whatsappURL = `https://wa.me/628115554155?text=${encodedMessage}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappURL, '_blank');
      
      // Show success message
      toast({
        title: "Order Submitted",
        description: "Your order has been submitted. Please complete the payment process on WhatsApp.",
      });
      
      // Clear cart and redirect
      // Note: We don't clear the cart here in case they need to reference it
      navigate("/thank-you");
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast({
        title: "Checkout Failed",
        description: "An error occurred while processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center text-islamic-teal mb-4 hover:text-islamic-green transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </Link>
        
        <h1 className="heading-primary mb-4">Checkout</h1>
        <p className="text-gray-600 max-w-2xl">
          Please provide your shipping information and select a payment method.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Enter your province"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Enter your postal code"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label>Select Payment Method</Label>
                  <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transfer Bank">
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Transfer Bank</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="COD">
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4" />
                          <span>Cash on Delivery (COD)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      Payment details will be sent to you via WhatsApp after order confirmation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {item.product.name} x {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.product.price.toFixed(2)} each
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <p>Total</p>
                    <p>${calculateTotal().toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-islamic-green hover:bg-islamic-green/90 flex items-center justify-center space-x-2"
                  disabled={isSubmitting}
                >
                  <ShoppingCart size={16} />
                  <span>{isSubmitting ? "Processing..." : "Complete Order"}</span>
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-4 p-4 bg-islamic-cream/30 rounded-lg text-sm">
              <p className="font-medium mb-2">Note:</p>
              <p>
                After clicking "Complete Order", you will be redirected to WhatsApp to confirm your order and complete the payment process.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
