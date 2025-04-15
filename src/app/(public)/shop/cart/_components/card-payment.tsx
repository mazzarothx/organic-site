"use client";

import { formatterBr } from "@/lib/utils";

import { FloatingInput } from "@/components/input-floating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CartDelivery, CartPayment } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCreditCard } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import * as z from "zod";
import { DeliveryMethodData, PaymentMethodData } from "./cart-data";

const cardSchema = z.object({
  holder: z.string().min(5),
  number: z.string().min(16),
  cvv: z.string().min(3),
  expiration: z.string().min(5),
});

interface CardPaymentProps {
  setSelectedDelivery: (delivery: CartDelivery) => void;
  setSelectedPayment: (payment: CartPayment) => void;
}
export default function CardPayment({
  setSelectedDelivery,
  setSelectedPayment,
}: CardPaymentProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <Delivery setSelectedDelivery={setSelectedDelivery} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <Payment setSelectedPayment={setSelectedPayment} />
        </CardContent>
      </Card>
    </>
  );
}

// #region Delivery

interface DeliveryProps {
  setSelectedDelivery: (delivery: CartDelivery) => void;
}

function Delivery({ setSelectedDelivery }: DeliveryProps) {
  const [delivery, setDelivery] = useState("Free");
  return (
    <div className="grid grid-cols-2 gap-6">
      {DeliveryMethodData.map((data) => (
        <DeliveryButton
          key={data.id}
          deliveryData={data}
          state={delivery}
          onClick={() => {
            setDelivery(data.name);
            setSelectedDelivery(data);
          }}
        />
      ))}
    </div>
  );
}

interface DeliveryButtonProps {
  deliveryData: CartDelivery;
  state: string;
  onClick: () => void;
}

function DeliveryButton({ deliveryData, state, onClick }: DeliveryButtonProps) {
  return (
    <Button
      variant="link3"
      className={`h-24 w-full border p-6 ${state === deliveryData.name ? "border-dash-text-primary/70" : "border-dash-input-border/70"}`}
      onClick={onClick}
    >
      <div className="flex w-full items-start gap-3">
        {deliveryData.icon}
        <div className="flex w-full flex-col items-start">
          <div className="flex h-7 w-full items-center justify-between gap-3">
            <p className="text-dash-text-primary text-base font-semibold">
              {deliveryData.name}
            </p>
            <p className="text-dash-text-primary text-base font-semibold">
              {formatterBr.format(deliveryData.price)}
            </p>
          </div>
          <p className="text-dash-text-secondary text-sm">
            {deliveryData.days}
          </p>
        </div>
      </div>
    </Button>
  );
}

// #endregion

// #region Payment

interface PaymentProps {
  setSelectedPayment: (payment: CartPayment) => void;
}
function Payment({ setSelectedPayment }: PaymentProps) {
  const [payment, setPayment] = useState("Pix");
  return (
    <div className="flex flex-col gap-6">
      <Button
        variant="link3"
        className={`flex min-h-24 w-full items-center justify-between border p-5 ${payment === "Pix" ? "border-dash-text-primary/70" : "border-dash-input-border/70"}`}
        onClick={() => {
          setPayment("Pix");
          setSelectedPayment(PaymentMethodData[0]);
        }}
      >
        <div className="flex w-full flex-col items-start justify-center">
          <p className="text-dash-text-primary text-lg font-semibold">Pix</p>
          <p className="text-dash-text-secondary text-sm">Pay with Pix</p>
        </div>
        <div>
          <FaPix className="h-7 w-7" />
        </div>
      </Button>

      <Button
        variant="link3"
        className={`flex h-fit min-h-24 w-full items-center justify-between border p-5 ${payment === "Credit" ? "border-dash-text-primary/70" : "border-dash-input-border/70"}`}
        onClick={() => {
          setPayment("Credit");
          setSelectedPayment(PaymentMethodData[1]);
        }}
      >
        <div className="flex h-full w-full flex-col gap-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full flex-col items-start justify-center">
              <p className="text-dash-text-primary text-lg font-semibold">
                Credit / Debit Card
              </p>
              <p className="text-dash-text-secondary text-sm">
                We support Mastercard, Visa, Discover and Stripe.
              </p>
            </div>
            <div>
              <FaCreditCard className="h-7 w-7" />
            </div>
          </div>
          {/* {payment === "Credit" && <CreditCard />} */}
        </div>
      </Button>
    </div>
  );
}

function CreditCard() {
  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {},
  });

  return (
    <Form {...form}>
      <form>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="holder"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput
                    label="Card Holder"
                    variant="fixLabel"
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput
                    label="Card Number"
                    variant="fixLabel"
                    placeholder="**** **** **** ****"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="holder"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput
                    label="CVV/CVC"
                    variant="fixLabel"
                    placeholder="***"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="holder"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput
                    label="Expiration"
                    variant="fixLabel"
                    placeholder="MM/YY"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

// #endregion
