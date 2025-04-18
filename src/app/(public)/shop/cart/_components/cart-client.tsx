"use client";

import { formatterBr } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaCheck, FaCircle } from "react-icons/fa";

import { useCurrentUser } from "@/app/(auth)/hooks/use-current-user";
import { FloatingInput } from "@/components/input-floating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import {
  Address,
  CartDelivery,
  CartPayment,
  CheckoutReq,
  Coupon,
} from "@/types";
import { FiEdit3 } from "react-icons/fi";
import { toast } from "sonner";
import CardBilling from "./card-billing";
import CartTable from "./card-cart-table";
import CardPayment from "./card-payment";
import { DeliveryMethodData, PaymentMethodData } from "./cart-data";

export const CartClient = () => {
  const router = useRouter();
  const cart = useCart();

  const [cartState, setCartState] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<CartDelivery | null>(
    DeliveryMethodData[0],
  );
  const [selectedPayment, setSelectedPayment] = useState<CartPayment | null>(
    PaymentMethodData[0],
  );

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const step = query.get("step");

    if (step !== null) {
      setCartState(Number(step));
    }

    if (!selectedAddress && localStorage.getItem("selectedAddress")) {
      setSelectedAddress(JSON.parse(localStorage.getItem("selectedAddress")!));
    }

    if (cart.items.length > 0) {
      const isValid = cart.validateCart();
      if (!isValid) {
        toast.error("Seu carrinho contém itens inválidos");
        // Opcional: Limpar itens inválidos
      }
    }
  }, []);

  useEffect(() => {
    router.push(`?step=${cartState}`, undefined);
  }, [cartState, router]);

  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
    }
  }, [selectedAddress]);

  return (
    <main className="flex w-[1300px] flex-col items-center p-10 pt-16">
      <div className="w-full">
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>
      <div className="mb-7 flex h-24 w-[70%] items-center gap-6">
        <div className="flex w-full px-6">
          {/* State 0 */}
          <div className="relative flex flex-col items-center gap-2">
            {cartState === 0 ? (
              <FaCircle className="text-dash-primary h-3 w-3" />
            ) : (
              <FaCheck className="text-dash-primary h-3 w-3" />
            )}
            <p className="text-dash-text-primary absolute top-8 text-sm font-semibold">
              Cart
            </p>
          </div>
          <div
            className={`mx-5 mt-[6px] h-[1px] w-full ${cartState === 0 ? "bg-dash-text-disabled" : "bg-dash-primary"}`}
          />
          {/* State 1 */}
          <div
            className={`text-dash-primary relative flex flex-col items-center gap-2`}
          >
            {cartState === 0 || cartState === 1 ? (
              <FaCircle
                className={`h-3 w-3 ${cartState !== 0 ? "text-dash-primary" : "text-dash-text-disabled"}`}
              />
            ) : (
              <FaCheck className="h-3 w-3" />
            )}
            <p
              className={`absolute top-8 flex w-40 items-center justify-center text-sm font-semibold ${cartState !== 0 ? "text-dash-text-primary" : "text-dash-text-disabled"}`}
            >
              Billing & address
            </p>
          </div>
          <div
            className={`mx-5 mt-[6px] h-[1px] w-full ${cartState === 0 || cartState === 1 ? "bg-dash-text-disabled" : "bg-dash-primary"}`}
          />
          {/* State 2 */}
          <div
            className={`text-dash-primary relative flex flex-col items-center gap-2`}
          >
            <FaCircle
              className={`h-3 w-3 ${cartState === 2 ? "text-dash-primary" : "text-dash-text-disabled"}`}
            />
            <p
              className={`absolute top-8 text-sm font-semibold ${cartState === 2 ? "text-dash-text-primary" : "text-dash-text-disabled"}`}
            >
              Payment
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center gap-6">
        <div className="w-full pb-6">
          {cartState === 0 && <CartTable />}

          {cartState === 1 && (
            <CardBilling
              setCartState={setCartState}
              setSelectedAddress={setSelectedAddress}
            />
          )}

          {cartState === 2 && (
            <CardPayment
              setSelectedDelivery={setSelectedDelivery}
              setSelectedPayment={setSelectedPayment}
            />
          )}
        </div>
        <div className="flex min-w-80 flex-col gap-6">
          {cartState === 2 && (
            <CartAddress
              cartState={cartState}
              setCartState={setCartState}
              address={selectedAddress}
            />
          )}
          <CartSummary
            cartState={cartState}
            setCartState={setCartState}
            selectedAddress={selectedAddress}
            selectedPayment={selectedPayment}
            selectedDelivery={selectedDelivery}
          />
        </div>
      </div>
    </main>
  );
};

// #region CartAddress
interface CartAddressProps {
  address: Address | null;
  cartState: number;
  setCartState: (state: number) => void;
}
function CartAddress({ address, cartState, setCartState }: CartAddressProps) {
  return (
    <Card>
      <CardContent>
        <div className="text-dash-text-primary flex items-center justify-between py-6">
          <p className="text-lg font-bold">Address</p>
          {cartState === 2 && (
            <Button
              variant={"ghost"}
              size={"sm"}
              className="text-dash-text-primary h-7"
              onClick={() => setCartState(1)}
            >
              <FiEdit3 className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
        </div>
        {!address ? (
          <div> No address found. </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <p className="text-dash-text-primary text-sm font-semibold">
                {address.fullName}
              </p>
            </div>
            <div className="text-dash-text-secondary flex flex-col gap-1 text-sm">
              <p>{address.logradouro}</p>
              <p>{`Numero:  ${address.numero}, ${address.complemento} `}</p>
              <p>{`CEP:  ${address.cep} - ${address.cidade}, ${address.estado} `}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// #endregion

// #region CartSummary

interface CartSummaryProps {
  cartState: number;
  selectedAddress: Address | null;
  selectedPayment: CartPayment | null;
  selectedDelivery: CartDelivery | null;
  setCartState: (state: number) => void;
}
function CartSummary({
  cartState,
  selectedAddress,
  selectedPayment,
  selectedDelivery,
  setCartState,
}: CartSummaryProps) {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const user = useCurrentUser();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const subTotalPrice = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  useEffect(() => {
    if (coupon) return;

    const couponA = JSON.parse(localStorage.getItem("coupon") as string);
    console.log(couponA);
    if (couponA) {
      setCoupon(couponA);
      setCouponCode(couponA.code);
    }
  }, []);

  const getDiscountValue = () => {
    if (!coupon) return 0;

    if (coupon.discountType === "Percentage") {
      return (subTotalPrice * coupon.discount) / 100;
    } else {
      return coupon.discount;
    }
  };

  const formattedDiscountValue = () => {
    if (!coupon) return "-";

    return `-${formatterBr.format(getDiscountValue())}`;
  };

  const totalPrice =
    subTotalPrice + (selectedDelivery?.price || 0) - getDiscountValue();

  const onCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address.");
      return;
    }
    if (!selectedPayment) {
      toast.error("Please select a payment method.");
      return;
    }
    if (!selectedDelivery) {
      toast.error("Please select a delivery method.");
      return;
    }

    const checkoutReq: CheckoutReq = {
      userId: user ? user.id : undefined,
      address: selectedAddress,
      paymentMethod: selectedPayment,
      deliveryMethod: selectedDelivery,
      coupon: coupon ? coupon : undefined,
      products: items,
    };

    if (selectedPayment.name === "Pix") {
      try {
        const response = await axios.post(
          `/api/gerencianet/checkout`,
          checkoutReq,
        );

        const { qrcode, qrcodeImage, amount } = response.data;

        localStorage.setItem("pixQrcode", qrcode);
        localStorage.setItem("pixQrcodeImage", qrcodeImage);
        localStorage.setItem("pixAmount", amount);

        router.push("/shop/cart/pix");
      } catch (error) {
        console.error("Erro ao processar o pagamento Pix:", error);
        toast.error("Erro ao processar o pagamento Pix.");
      }
    }

    if (selectedPayment.name === "Credit") {
      try {
        const response = await axios.post(`/api/stripe/checkout`, checkoutReq);

        // window.location.href = response.data.url;
        window.open(response.data.url, "_blank");
      } catch (error) {
        console.error("Erro ao redirecionar para o checkout do Stripe:", error);
      }
    }
  };

  const onRemoveCoupon = () => {
    setCoupon(null);
    localStorage.removeItem("coupon");
    toast.success("Coupon code removed successfully.");
  };

  const couponCheck = async () => {
    if (!couponCode) {
      toast.error("Please insert a coupon code.");
      return;
    }
    try {
      const response = await axios.get(`/api/shop/coupons/${couponCode}`);
      if (response.data) {
        const couponA = {
          code: response.data.code,
          discount: response.data.discount,
          discountType: response.data.discountType,
        };
        setCoupon(couponA);
        localStorage.setItem("coupon", JSON.stringify(couponA));
        toast.success("Coupon code applied successfully.");
      } else {
        toast.error("Coupon code not found.");
      }
    } catch (error) {
      toast.error("Coupon code not found.");
    }
  };

  return (
    <div className="min-w-80">
      <Card className="w-full">
        <CardContent>
          <div className="text-dash-text-primary flex items-center justify-between py-6">
            <p className="text-lg font-bold">Order summary</p>
            {cartState === 2 && (
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-dash-text-primary h-7"
                onClick={() => setCartState(0)}
              >
                <FiEdit3 className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p className="text-dash-text-secondary text-sm">Sub total</p>
              <p className="text-dash-text-primary text-sm font-bold">
                {formatterBr.format(subTotalPrice)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-dash-text-secondary text-sm">Discount</p>
              <p className="text-dash-text-primary text-sm font-bold">
                {formattedDiscountValue()}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-dash-text-secondary text-sm">Shipping</p>
              <p className="text-dash-text-primary text-sm font-bold">
                {formatterBr.format(selectedDelivery?.price || 0)}
              </p>
            </div>
          </div>
          <Separator className="border-dash-input-border my-5 border border-dashed bg-transparent" />
          <div className="flex justify-between">
            <p className="text-dash-text-primary text-base font-bold">Total</p>
            <p className="text-dash-error text-sm font-bold">
              {formatterBr.format(totalPrice)}
            </p>
          </div>
          {cartState === 0 && (
            <div className="relative mt-10 mb-4">
              <FloatingInput
                label="Coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              {!coupon ? (
                <Button
                  variant="ghost"
                  className="text-dash-primary-light absolute top-1/2 right-2 -translate-y-1/2"
                  onClick={couponCheck}
                >
                  Apply
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="text-dash-error-light absolute top-1/2 right-2 -translate-y-1/2"
                  onClick={onRemoveCoupon}
                >
                  Remove
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {cartState === 0 && (
        <Button className="mt-5 w-full" onClick={() => setCartState(1)}>
          Checkout
        </Button>
      )}
      {cartState === 2 && (
        <Button
          className="mt-5 w-full"
          onClick={() => {
            onCheckout();
          }}
        >
          Complete Order
        </Button>
      )}
    </div>
  );
}

function useUser() {
  throw new Error("Function not implemented.");
}
// #endregion
