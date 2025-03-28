
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { addOrder } from "../services/OrderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, CreditCard, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, calculateTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate("/products");
    }
  }, [cart, navigate]);

  const formatToRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form
    if (!name || !phone || !province || !city || !postalCode || !address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create order text for WhatsApp
      const total = calculateTotal();
      const cartItems = cart.map(item => `${item.product.name} (${item.quantity}x)`).join("\n- ");
      
      // Format WhatsApp message
      const message = encodeURIComponent(`*NEW ORDER*
      
*Customer Info:*
Name: ${name}
Phone: ${phone}
Address: ${address}
${city}, ${province} ${postalCode}

*Order Details:*
- ${cartItems}

*Total: ${formatToRupiah(total)}*
*Payment Method: ${paymentMethod === "transfer" ? "Transfer" : "COD (Cash on Delivery)"}*
      
Thank you for your order!`);
      
      // Create record of recent order
      const productNames = cart.map(item => item.product.name);
      await addOrder({
        customerName: name,
        productNames,
        location: `${city}, ${province}`,
        paymentMethod: paymentMethod === "transfer" ? "Transfer" : "COD"
      });
      
      // Open WhatsApp with the message
      window.open(`https://wa.me/628115554155?text=${message}`, "_blank");
      
      // Clear cart and show success message
      clearCart();
      
      toast({
        title: "Order Placed!",
        description: "Your order has been submitted. Please complete payment via WhatsApp.",
      });
      
      // Redirect to recent orders page
      navigate("/recent-orders");
      
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: "Failed to submit order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-8">
        <h1 className="heading-primary mb-4">Checkout</h1>
        <p className="text-gray-600 max-w-2xl">
          Complete your order by providing your shipping information and payment method.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
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
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City/Regency</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter your city/regency"
                      required
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
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full address"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                      <span className="font-medium">Bank Transfer</span>
                      <p className="text-sm text-gray-500">
                        Pay via bank transfer. Instructions will be sent via WhatsApp.
                      </p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <span className="font-medium">Cash on Delivery (COD)</span>
                      <p className="text-sm text-gray-500">
                        Pay when you receive the product.
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full bg-islamic-green hover:bg-islamic-green/90 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Processing..." : "Complete Order"}
                  {!isSubmitting && <ArrowRight size={16} />}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between">
                        <div>
                          <p className="font-medium">
                            {item.product.name} 
                            <span className="text-gray-500 ml-1">x{item.quantity}</span>
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatToRupiah(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-b py-3 my-3">
                    <div className="flex justify-between font-medium">
                      <p>Total</p>
                      <p className="text-islamic-gold">
                        {formatToRupiah(calculateTotal())}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>
                      By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                    </p>
                    <p className="mt-2">
                      Payment instructions will be provided via WhatsApp after order confirmation.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
