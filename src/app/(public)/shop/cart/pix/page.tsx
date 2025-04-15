"use client";

import { Button } from "@/components/ui/button";
import { formatterBr } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCopy } from "react-icons/io5";

const PixPage = () => {
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [qrcodeImage, setQrcodeImage] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedQrcode = localStorage.getItem("pixQrcode");
    const storedQrcodeImage = localStorage.getItem("pixQrcodeImage");
    const storedAmount = localStorage.getItem("pixAmount");

    // if (!storedQrcode && !storedQrcodeImage && !storedAmount) {
    //   redirect("/shop/cart");
    // }

    if (storedQrcode) {
      setQrcode(storedQrcode);
    }

    if (storedQrcodeImage) {
      setQrcodeImage(storedQrcodeImage);
    }

    if (storedAmount) {
      setAmount(storedAmount);
    }

    localStorage.removeItem("pixQrcode");
    localStorage.removeItem("pixQrcodeImage");
    localStorage.removeItem("pixAmount");
  }, []);

  return (
    <main className="flex w-full max-w-[1300px] flex-col items-center p-10 pt-16">
      <div className="w-full">
        <h1 className="text-dash-text-primary text-2xl font-bold">
          Aguardando sua transferência via Pix
        </h1>
        <div className="w-full">
          <p className="text-dash-text-primary mt-8 text-lg font-semibold">
            {formatterBr.format(Number(amount))}
          </p>

          <p className="text-dash-text-primary mt-8 text-lg font-semibold">
            Copia e Cola
          </p>
          <div className="bg-dash-background-secondary relative mt-6 h-24 w-full rounded-2xl p-4 pr-16">
            <p className="text-dash-text-primary h-full w-full overflow-auto break-words">
              {qrcode}
            </p>
            <Button
              variant="ghost"
              size={"sm"}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full p-0"
            >
              <IoCopy className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-8 flex w-full gap-6">
            <div className="bordar-bg-dash-background-ternary aspect-square h-[400px] w-[400px] border-2 border-dashed p-2">
              {qrcodeImage && (
                <Image
                  src={qrcodeImage}
                  alt="qrcode"
                  width={400}
                  height={400}
                  className="h-full w-full rounded-2xl"
                />
              )}
            </div>
            <div className="flex grow flex-col justify-center gap-16">
              <div className="flex gap-6">
                <p className="text-dash-text-secondary">
                  Abra o app do seu banco ou instituição financeira e entre no
                  ambiente Pix
                </p>
              </div>
              <div className="flex gap-6">
                <p className="text-dash-text-secondary">
                  Escolha a opção Pagar com QR Code e escaneie o código ao lado
                  oi utilize o recurso Copia e Cola.
                </p>
              </div>
              <div className="flex gap-6">
                <p className="text-dash-text-secondary">
                  Confirme as informações e finalize o pagamento. Pode demorar
                  alguns minutos até que o pagamento seja confirmado. Iremos
                  avisar você!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PixPage;
