"use client";

import { useCurrentUser } from "@/app/(auth)/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ReactNode } from "react";
import { BsFillGridFill } from "react-icons/bs";
import { FaHeart, FaShoppingBag, FaShoppingCart } from "react-icons/fa";
import { IoChatbubbles } from "react-icons/io5";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { RiFileListFill } from "react-icons/ri";
import OrderCard from "./order-card";

const MyAccountClient = () => {
  const user = useCurrentUser();
  return (
    <Card className="w-full pt-6">
      <CardContent>
        <div className="flex h-full w-full flex-col gap-10">
          <div className="flex gap-4">
            <Card className="w-full">
              <CardContent className="bg-dash-background-primary/70 h-40 w-full rounded-3xl pt-6">
                <div className="flex h-full items-center gap-6">
                  <Image
                    src={user?.image || ""}
                    alt="profile"
                    width={100}
                    height={100}
                    className="h-24 w-24 rounded-full"
                  />
                  <div>
                    <p className="text-dash-text-primary text-xl font-semibold">{`Olá, ${user?.name}`}</p>
                    <p className="text-dash-text-secondary mt-1 text-sm">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent className="bg-dash-background-primary/70 h-40 w-full rounded-3xl pt-6">
                <div className="flex h-full items-center justify-between gap-6">
                  <div>
                    <p className="text-dash-text-secondary text-sm">
                      Saldo Disponível
                    </p>
                    <p className="text-dash-text-primary mt-2 text-3xl font-semibold">
                      R$ 0,00
                    </p>
                  </div>
                  <Button>
                    Ver Carteira <MdOutlineArrowForwardIos />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <p className="text-dash-text-secondary flex items-center text-xs font-semibold uppercase">
              <FaShoppingCart className="text-dash-primary mr-2 mb-0.5" />{" "}
              Detalhes do seu ultimo pedido
            </p>

            <OrderCard cardClassName="rounded-3xl mt-3 bg-dash-background-primary/70" />
          </div>

          <div>
            <p className="text-dash-text-secondary flex items-center text-xs font-semibold uppercase">
              <BsFillGridFill className="text-dash-primary mr-2 mb-0.5" />
              Atalhos
            </p>

            <div className="mt-3 grid grid-cols-4 items-end gap-4">
              <ShortcutsButton
                text="My Orders"
                icon={<FaShoppingBag className="text-dash-primary h-8 w-8" />}
              />
              <ShortcutsButton
                text="Favourites"
                icon={<FaHeart className="text-dash-primary h-8 w-8" />}
              />
              <ShortcutsButton
                text="Customer service"
                icon={<IoChatbubbles className="text-dash-primary h-8 w-8" />}
              />
              <ShortcutsButton
                text="Protocols"
                icon={<RiFileListFill className="text-dash-primary h-8 w-8" />}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyAccountClient;

function ShortcutsButton({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <Button
      variant={"link3"}
      className="bg-dash-background-primary/70 flex h-32 w-full flex-col items-center justify-center gap-3 rounded-2xl"
    >
      {icon}
      <p className="font-semibold">{text}</p>
    </Button>
  );
}
