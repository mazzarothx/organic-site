import { User } from "@prisma/client";
import OrderCard from "../../_components/order-card";

interface OrdersClientProps {
  user: User | null;
}
const OrdersClient: React.FC<OrdersClientProps> = ({ user }) => {
  return (
    <div className="flex h-full w-full flex-col gap-6">
      <OrderCard />
      <OrderCard />
    </div>
  );
};

export default OrdersClient;
