import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FaHourglassHalf } from "react-icons/fa";
import { MdOutlineArrowForwardIos } from "react-icons/md";

interface OrderCardProps {
  cardClassName?: string;
}
export default function OrderCard({ cardClassName }: OrderCardProps) {
  return (
    <Card className={cardClassName}>
      <CardContent>
        <div className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-dash-text-secondary font-semibold">
              #0001{" "}
              <span className="text-dash-text-secondary text-sm font-normal">
                - 01/01/2022
              </span>
            </p>
            <Button
              variant={"link2"}
              className="text-dash-primary hover:text-dash-primary-light/80"
            >
              Ver Detalhes <MdOutlineArrowForwardIos />
            </Button>
          </div>
          <div className="text-dash-text-secondary mt-3 flex items-center text-sm">
            <FaHourglassHalf className="mr-1 h-3 w-3" /> Pedido Pendente
          </div>
          <div className="mt-6 flex items-center">
            <Image
              src="/1.png"
              alt="shirt"
              width={90}
              height={90}
              className="rounded-2xl"
            />
            <div className="flex w-full items-center justify-between">
              <div className="ml-5 flex flex-col">
                <p className="text-dash-text-secondary text-sm font-semibold">
                  Camisa Organic 3
                </p>
                <p className="text-dash-text-secondary mt-2 text-sm">
                  P | White
                </p>
              </div>
              <div className="text-dash-text-secondary flex items-center justify-between pr-6 text-sm">
                <p className="mr-10">x2</p>
                <p>R$ 150,00</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
