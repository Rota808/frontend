import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/sonner";
import { apiService, User, Order, OrderItem, Payment } from "@/services/api";
import { paymentService } from "@/services/payment";
import { ORDER_STATUS } from "@/services/orderStatus";
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
import { CreditCard, Banknote, ShoppingBag, QrCode } from "lucide-react";
import PixQRCode from "@/components/PixQRCode";
import MercadoPagoPayment from "@/components/MercadoPagoPayment";

const formSchema = z.object({
  fullName: z.string().min(2, "Nome completo é obrigatório"),
  contactNumber: z.string().min(5, "Número de contato válido é obrigatório"),
  deliveryAddress: z.string().min(5, "Endereço de entrega é obrigatório"),
  saveInfo: z.boolean().default(false),
  paymentMethod: z.enum(["credit_card", "cash", "pix", "mercadopago"], {
    required_error: "Por favor selecione um método de pagamento",
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

const checkoutFormSchema = z.preprocess((data) => {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  const formData = data as z.infer<typeof formSchema>;

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
  const [pixQRCode, setPixQRCode] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

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

  useEffect(() => {
    const savedUser = apiService.getSavedUser();
    if (savedUser) {
      form.setValue("fullName", savedUser.full_name);
      form.setValue("contactNumber", savedUser.contact_number);
      form.setValue("deliveryAddress", savedUser.saved_address);
      form.setValue("saveInfo", savedUser.saved_info);
    }
  }, [form]);

  const watchPaymentMethod = form.watch("paymentMethod");

  const onSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    try {
      setIsSubmitting(true);

      const userData: User = {
        full_name: values.fullName,
        contact_number: values.contactNumber,
        saved_address: values.deliveryAddress,
        saved_info: values.saveInfo,
      };

      const user = await apiService.createUser(userData);

      const orderData: Order = {
        user: user.id!,
        delivery_address: values.deliveryAddress,
        contact_phone: values.contactNumber,
        total_price: Number((totalPrice + 3.99).toFixed(2)),
        status: ORDER_STATUS.PAYMENT_PENDING,
      };

      const order = await apiService.createOrder(orderData);
      setCreatedOrderId(order.id);

      setPreferenceId("DUMMY_PREFERENCE_ID");

      let paymentResult;
      if (values.paymentMethod === "mercadopago") {
        paymentResult = await paymentService.processMercadoPagoPayment(
          orderData.total_price,
          order.id
        );
      } else if (values.paymentMethod === "credit_card") {
        paymentResult = await paymentService.processCreditCardPayment(
          values.cardNumber || "",
          values.cardExpiry || "",
          values.cardCvc || "",
          orderData.total_price,
          order.id
        );
      } else if (values.paymentMethod === "pix") {
        paymentResult = await paymentService.processPixPayment(
          orderData.total_price,
          order.id
        );
        if (paymentResult.success && paymentResult.pixQrCode) {
          setPixQRCode(paymentResult.pixQrCode);
        }
      } else {
        paymentResult = await paymentService.processCashPayment(
          orderData.total_price,
          order.id
        );
      }

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Payment processing failed");
      }

      const paymentData: Payment = {
        order: order.id!,
        payment_method: values.paymentMethod,
        transaction_id: paymentResult.transactionId,
        ...(values.paymentMethod === "credit_card" && {
          card_last_four: values.cardNumber?.slice(-4) || "",
        }),
        ...(values.paymentMethod === "pix" && {
          pix_qr_code: paymentResult.pixQrCode,
        }),
      };

      await apiService.createPayment(paymentData);

      if (values.paymentMethod !== "pix") {
        clearCart();
        toast.success("Pedido realizado com sucesso!");
        navigate(`/order-tracking?orderId=${order.id}`);
      } else {
        toast.success("QR Code PIX gerado! Por favor, complete o pagamento.");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      toast.error(
        "Houve um problema ao processar seu pedido. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompletePIXPayment = async () => {
    if (!createdOrderId) return;

    try {
      setIsSubmitting(true);
      const result = await paymentService.confirmPixPayment(createdOrderId);

      if (result.success) {
        clearCart();
        toast.success(
          "Pagamento PIX confirmado! Seu pedido está sendo preparado."
        );
        navigate(`/order-tracking?orderId=${createdOrderId}`);
      } else {
        toast.error(result.error || "Erro ao confirmar pagamento");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Houve um erro ao confirmar o pagamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pizza-container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        <FormLabel>Método de Pagamento</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mercadopago" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <CreditCard className="mr-2 h-4 w-4" />
                                MercadoPago
                              </FormLabel>
                            </FormItem>
                            {/* <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="credit_card" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Cartão de Crédito
                              </FormLabel>
                            </FormItem> */}
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cash" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <Banknote className="mr-2 h-4 w-4" />
                                Dinheiro na Entrega
                              </FormLabel>
                            </FormItem>
                            {/* <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="pix" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <QrCode className="mr-2 h-4 w-4" />
                                PIX
                              </FormLabel>
                            </FormItem> */}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchPaymentMethod === "mercadopago" && (
                    <div className="mt-4">
                      <MercadoPagoPayment
                        orderId={createdOrderId ? String(createdOrderId) : ""}
                        cartItems={items.map((item) => ({
                          id: String(
                            item.type === "pizza"
                              ? item.pizza.id
                              : item.beverage.id
                          ),
                          name:
                            item.type === "pizza"
                              ? item.pizza.pizza_name
                              : item.beverage.beverage_name,
                          price: item.price,
                          quantity: item.quantity,
                        }))}
                        userInfo={{
                          email: "", // Provide user email if available
                          phone: form.getValues("contactNumber"),
                        }}
                      />
                    </div>
                  )}

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

                  {pixQRCode && form.watch("paymentMethod") === "pix" && (
                    <div className="mt-4">
                      <PixQRCode value={pixQRCode} amount={totalPrice + 3.99} />
                      <Button
                        type="button"
                        className="mt-4 w-full bg-green-600 hover:bg-green-700"
                        onClick={handleCompletePIXPayment}
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Processando..."
                          : "Confirmar Pagamento PIX"}
                      </Button>
                      <p className="text-xs text-center mt-2 text-muted-foreground">
                        Clique para simular a confirmação do pagamento PIX
                      </p>
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
                      disabled={isSubmitting || !!pixQRCode}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

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
