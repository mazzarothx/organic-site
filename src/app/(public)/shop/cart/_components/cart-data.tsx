import { CartDelivery, CartPayment } from "@/types";
import { FaBicycle, FaCreditCard } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { LuTruck } from "react-icons/lu";
import { MdOutlineRocketLaunch } from "react-icons/md";

export const PaymentMethodData: CartPayment[] = [
  {
    id: "0",
    name: "Pix",
    description: "Pay with Pix",
    icon: <FaPix className="h-7 w-7" />,
  },
  {
    id: "1",
    name: "Credit",
    description: "We support Mastercard, Visa, Discover and Stripe.",
    icon: <FaCreditCard className="h-7 w-7" />,
  },
];

export const DeliveryMethodData: CartDelivery[] = [
  {
    id: "0",
    name: "Free",
    price: 0,
    days: "5-7 days delivery",
    icon: <FaBicycle className="h-7 w-7" />,
  },
  {
    id: "1",
    name: "Standard",
    price: 10,
    days: "3-5 days delivery",
    icon: <LuTruck className="h-7 w-7" />,
  },
  {
    id: "2",
    name: "Express",
    price: 20,
    days: "2-3 days delivery",
    icon: <MdOutlineRocketLaunch className="h-7 w-7" />,
  },
];
