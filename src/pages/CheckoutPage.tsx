import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/sonner";
import { apiService, User, Order, OrderItem, Payment } from "@/services/api";
import { paymentService } from "@/services/payment";
import { useCart } from "@/contexts/CartContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Banknote, ShoppingBag } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  contactNumber: z.string().min(5, "Valid contact number is required"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  saveInfo: z.boolean().default(false),
  paymentMethod: z.enum(["credit_card", "cash"], {
    required_error: "Please select a payment method",
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

// Conditional validation for credit card fields
const checkoutFormSchema = z.preprocess((data) => {
  // If data is not an object, return it as is
  if (typeof data !== "object" || data === null) {
    return data;
  }

  // Cast to the expected shape to make TypeScript happy
  const formData = data as z.infer<typeof formSchema>;

  // If payment method is credit card, card fields are required
  if (formData.paymentMethod === "credit_card") {
    return {
      ...formData,
      cardNumber: z
        .string()
        .min(13, "Card number must be between 13-19 digits")
        .max(19, "Card number must be between 13-19 digits")
        .regex(/^\d+$/, "Card number must contain only digits")
        .parse(formData.cardNumber),
      cardExpiry: z
        .string()
        .regex(
          /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
          "Expiry must be in MM/YY format"
        )
        .parse(formData.cardExpiry),
      cardCvc: z
        .string()
        .length(3, "CVC must be 3 digits")
        .regex(/^\d+$/, "CVC must contain only digits")
        .parse(formData.cardCvc),
    };
  }

  return formData;
}, formSchema);

type CheckoutFormValues = z.infer<typeof formSchema>;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      deliveryAddress: "",
      saveInfo: false,
      paymentMethod: "cash",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");

  const onSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Create user
      const userData: User = {
        full_name: values.fullName,
        contact_number: values.contactNumber,
        saved_address: values.deliveryAddress,
        saved_info: values.saveInfo,
      };

      const user = await apiService.createUser(userData);

      // 2. Create order
      const orderData: Order = {
        user: user.id!,
        delivery_address: values.deliveryAddress,
        contact_phone: values.contactNumber,
        total_price: Number((totalPrice + 3.99).toFixed(2)),
        status: "pending",
      };

      const order = await apiService.createOrder(orderData);

      // 3. Process payment
      let paymentResult;

      if (values.paymentMethod === "credit_card") {
        paymentResult = await paymentService.processCreditCardPayment(
          values.cardNumber || "",
          values.cardExpiry || "",
          values.cardCvc || "",
          orderData.total_price
        );
      } else {
        paymentResult = await paymentService.processCashPayment(
          orderData.total_price
        );
      }

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Payment processing failed");
      }

      // 4. Create payment record
      const paymentData: Payment = {
        order: order.id!,
        payment_method: values.paymentMethod,
        // Only include card details if paying by card
        ...(values.paymentMethod === "credit_card" && {
          card_last_four: values.cardNumber?.slice(-4) || "",
          transaction_id: paymentResult.transactionId,
        }),
        ...(values.paymentMethod === "cash" && {
          transaction_id: paymentResult.transactionId,
        }),
      };

      await apiService.createPayment(paymentData);

      // Success! Clear cart and redirect to confirmation
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-tracking?orderId=${order.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        "There was a problem processing your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pizza-container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5 text-pizza-primary" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your full address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="saveInfo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Save my information for future orders
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="credit_card" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Credit Card
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cash" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <Banknote className="mr-2 h-4 w-4" />
                                Cash on Delivery
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchPaymentMethod === "credit_card" && (
                    <div className="space-y-4 pt-2 border-t">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="4111 1111 1111 1111"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cardExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cardCvc"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/cart")}
                    >
                      Back to Cart
                    </Button>

                    <Button
                      type="submit"
                      className="bg-pizza-primary hover:bg-pizza-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="divide-y">
                  {items.map((item, index) => (
                    <div key={index} className="py-2">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-medium">
                            {item.quantity} x{" "}
                            {item.type === "pizza"
                              ? item.pizza.pizza_name
                              : item.beverage.beverage_name}
                          </span>
                          {item.type === "pizza" && (
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size.size_name}
                            </p>
                          )}
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between pb-2">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span>Delivery Fee</span>
                    <span>$3.99</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t text-lg font-bold">
                    <span>Total</span>
                    <span>${(totalPrice + 3.99).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
