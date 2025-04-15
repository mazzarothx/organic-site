import { db } from "@/app/(auth)/lib/db";
import OrdersClient from "./_components/orders-client";
import { currentUser } from "@/app/(auth)/lib/auth";

const OrderPage = async () => {
  const userSession = await currentUser();
  const user = await db.user.findUnique({
    where: {
      id: userSession?.id,
    },
  });
  return (
    <div className="h-full w-full">
      <OrdersClient user={user} />
    </div>
  );
};

export default OrderPage;
