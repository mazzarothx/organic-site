"use client";

// #region imports

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { FloatingInput } from "@/components/input-floating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Address } from "@/types";
import { createId } from "@paralleldrive/cuid2";
import axios from "axios";
// #endregion

const formSchema = z.object({
  id: z.string().optional(),
  identification: z.string().min(2),
  default: z.boolean().default(false),
  fullName: z.string().min(2),
  cep: z.string().min(2),
  logradouro: z.string().min(2),
  numero: z.string().min(2),
  complemento: z.string().optional(),
  referencia: z.string().optional(),
  bairro: z.string().min(2),
  cidade: z.string().min(2),
  estado: z.string().min(2),
  pais: z.string().default("Brasil"),
});

interface NoUserBillingProps {
  setCartState: (state: number) => void;
  setSelectedAddress: (address: Address | null) => void;
}
export default function NoUserBilling({
  setCartState,
  setSelectedAddress,
}: NoUserBillingProps) {
  const [asGuest, setAsGuest] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (localStorage.getItem("selectedAddress")) {
      setAddress(JSON.parse(localStorage.getItem("selectedAddress")!));
    }

    if (localStorage.getItem("asGuest")) {
      setAsGuest(true);
    }
  }, []);

  const saveGuest = () => {
    setAsGuest(true);
    localStorage.setItem("asGuest", "true");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {asGuest ? (
          <AddressForm
            address={address}
            setCartState={setCartState}
            setSelectedAddress={setSelectedAddress}
          />
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex w-96 flex-col">
              <p className="text-dash=text-primary text-xl font-bold">
                Sign in to your account
              </p>
              <p className="text-dash-text-secondary mt-4 text-sm">
                Don&apos;t have an account?
                <span className="text-dash-primary ml-2 font-bold underline">
                  Get started
                </span>
              </p>
              <div className="mt-10 flex flex-col gap-6">
                <FloatingInput label="Email address" variant="fixLabel" />
                <div className="flex flex-col items-end">
                  <Button
                    className="text-dash-text-secondary mb-1 p-0 text-xs"
                    variant={"link"}
                    size={"sm"}
                  >
                    Forgot Password?
                  </Button>

                  <div className="w-full">
                    <FloatingInput
                      label="Password"
                      variant="passwordFixLabel"
                    />
                  </div>
                </div>

                <Button className="w-full" size={"lg"} onClick={() => null}>
                  Sign in
                </Button>
                <div className="flex w-full items-center gap-4">
                  <div className="bg-dash-input-border h-[1px] w-full"></div>
                  <p>Or</p>
                  <div className="bg-dash-input-border h-[1px] w-full"></div>
                </div>

                <Button
                  className="w-full"
                  size={"lg"}
                  variant={"outline"}
                  onClick={() => saveGuest()}
                >
                  Continue as a Guest
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// #region Form ----------------------------------------------------------------
interface AddressFormProps {
  address?: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  setCartState: (state: number) => void;
}
function AddressForm({
  address,
  setSelectedAddress,
  setCartState,
}: AddressFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...address },
  });

  const handleCepChange = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`,
        );

        if (!response.data.logradouro) {
          toast.error("Cep não encontrado");
          return;
        }
        form.setValue("logradouro", response.data.logradouro);
        form.setValue("bairro", response.data.bairro);
        form.setValue("cidade", response.data.localidade);
        form.setValue("estado", response.data.estado);
      } catch (error) {
        toast.error("Cep não encontrado");
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const id = address?.id || createId();
      const newAddress = {
        id,
        identification: data.identification,
        default: data.default,
        fullName: data.fullName,
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || "",
        referencia: data.referencia || "",
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        pais: data.pais,
      };

      setSelectedAddress(newAddress);

      toast.success(
        address ? "Address updated successfully" : "Address added successfully",
      );

      setTimeout(() => {
        setCartState(2);
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      label="Nome Completo"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3 grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="identification"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      label="Identificação"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      label="CEP"
                      disabled={loading}
                      value={field.value}
                      onChange={(e) => {
                        handleCepChange(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="logradouro"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      label="Logradouro"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput label="Numero" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-3 flex flex-col gap-6">
            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      label="Complemento"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referencia"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      label="Referência"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput label="Bairro" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput label="Cidade" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput label="Estado" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-3 flex items-center gap-4">
            <FormField
              control={form.control}
              name="default"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                        id="default"
                      />
                      <Label htmlFor="default" className="cursor-pointer">
                        Use this address as default.
                      </Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex w-full justify-end pt-6">
          <Button type="submit" disabled={loading} onClick={() => onSubmit}>
            {address ? "Update Address" : "Delivery to this Address"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// #endregion
