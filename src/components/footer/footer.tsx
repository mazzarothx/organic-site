"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

function Footer() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // ou um fallback
  }

  const logoSrc =
    resolvedTheme === "dark"
      ? "/logos/organic-logo-branco.svg"
      : "/logos/organic-logo-preto.svg";
  return (
    <div className="mt-12 flex h-[420px] w-full flex-col items-center justify-center">
      <div className="border-foreground/20 flex h-[340px] w-full items-end justify-center border-t-1">
        <div className="flex h-[60%] w-[70%] items-center justify-between gap-2">
          {/* Primeira coluna com título e texto */}
          <div className="flex h-full w-[20%] flex-col gap-4 p-4">
            <Image
              src={logoSrc}
              alt="Logo"
              width={100}
              height={28}
              aria-hidden="true"
            />
            <p className="text-foreground/60 text-sm">
              Somos uma empresa comprometida com produtos naturais e
              sustentáveis, levando qualidade de vida para nossos clientes.
            </p>
            <div className="flex items-center gap-4">
              <FaFacebookF className="size-5 cursor-pointer" />
              <FaInstagram className="size-5 cursor-pointer" />
              <FaLinkedinIn className="size-5 cursor-pointer" />
              <FaXTwitter className="size-5 cursor-pointer" />
            </div>
          </div>

          {/* Segunda coluna (vazia, mantendo o bg para visualização) */}
          <div className="h-full w-[20%]"></div>

          {/* Terceira coluna com lista de links */}
          <div className="flex h-full w-[20%] flex-col gap-2 p-4">
            <h4 className="text-foreground mb-2 font-semibold">Produtos</h4>
            <ul className="text-foreground/60 flex flex-col gap-2 text-sm">
              <li className="hover:text-foreground cursor-pointer">
                Orgânicos
              </li>
              <li className="hover:text-foreground cursor-pointer">Veganos</li>
              <li className="hover:text-foreground cursor-pointer">
                Sem glúten
              </li>
              <li className="hover:text-foreground cursor-pointer">
                Sem lactose
              </li>
            </ul>
          </div>

          {/* Quarta coluna com lista de links */}
          <div className="flex h-full w-[20%] flex-col gap-2 p-4">
            <h4 className="text-foreground mb-2 font-semibold">Links Úteis</h4>
            <ul className="text-foreground/60 flex flex-col gap-2 text-sm">
              <li className="hover:text-foreground cursor-pointer">
                Sobre nós
              </li>
              <li className="hover:text-foreground cursor-pointer">Blog</li>
              <li className="hover:text-foreground cursor-pointer">FAQ</li>
              <li className="hover:text-foreground cursor-pointer">Contato</li>
            </ul>
          </div>

          {/* Quinta coluna com lista de links */}
          <div className="flex h-full w-[20%] flex-col gap-2 p-4">
            <h4 className="text-foreground mb-2 font-semibold">Legal</h4>
            <ul className="text-foreground/60 flex flex-col gap-2 text-sm">
              <li className="hover:text-foreground cursor-pointer">
                Termos de uso
              </li>
              <li className="hover:text-foreground cursor-pointer">
                Política de privacidade
              </li>
              <li className="hover:text-foreground cursor-pointer">
                Trocas e devoluções
              </li>
              <li className="hover:text-foreground cursor-pointer">
                Rastrear pedido
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-foreground/20 flex h-[80px] w-full items-center justify-center">
        <p className="text-foreground/60 flex w-[70%] items-start p-4 text-sm">
          <span className="pr-1 font-semibold">ORGANIC COMPANY ©</span> Todos
          os direitos reservados.
        </p>
      </div>
    </div>
  );
}

export default Footer;
