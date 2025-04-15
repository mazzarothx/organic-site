"use client";

// #region imports
import { useCurrentUser } from "@/app/(auth)/hooks/use-current-user";

import { updateUserAddress } from "@/app/(auth)/actions/settings";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaRegStar } from "react-icons/fa";
import { toast } from "sonner";
import * as z from "zod";

import { FloatingInput } from "@/components/input-floating";
import { AlertModal } from "@/components/modal/alert-modal";
import { ChildrenModal } from "@/components/modal/children-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Address } from "@/types";
import { createId } from "@paralleldrive/cuid2";
import axios from "axios";
import { FiEdit3 } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";
import NoUserBilling from "./no-user";
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

interface CardBillingProps {
  setCartState: (state: number) => void;
  setSelectedAddress: (address: Address | null) => void;
}
export default function CardBilling({
  setCartState,
  setSelectedAddress,
}: CardBillingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useCurrentUser();
  const { update } = useSession();

  const address: Address[] = Array.isArray(user?.address) ? user.address : [];

  const handleDelete = async (addressData: Address) => {
    try {
      const updatedAddress = address.filter((a) => a.id !== addressData.id);
      await updateUserAddress(updatedAddress);
      update();
      toast.success("Address deleted successfully.");
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  const handleUpdate = async (data: z.infer<typeof formSchema>) => {
    try {
      const updatedAddress = address.map((a) => {
        if (a.id === data.id) {
          return data;
        }
        return a;
      });
      await updateUserAddress(updatedAddress);
      update();
      toast.success("Address updated successfully.");
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  const handleAdd = async (data: z.infer<typeof formSchema>) => {
    try {
      const updatedAddress = [...address, data];
      await updateUserAddress(updatedAddress);
      update();
      setIsModalOpen(false);
      toast.success("Address added successfully.");
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  const handleSetDefault = async (addressData: Address) => {
    try {
      const updatedAddress = address.map((a) => {
        if (a.id === addressData.id) {
          return { ...a, default: true };
        }
        return { ...a, default: false };
      });
      await updateUserAddress(updatedAddress);
      update();
      toast.success("Address set as default successfully.");
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="w-full">
      {!user ? (
        <NoUserBilling
          setCartState={setCartState}
          setSelectedAddress={setSelectedAddress}
        />
      ) : (
        <>
          {address.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <AddressForm />
              </CardContent>
            </Card>
          ) : (
            <div className="flex w-full flex-col gap-4">
              <ChildrenModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={address ? "Edit Address" : "Add Address"}
                loading={loading}
                onConfirm={() => null}
                className="bg-dash-background-secondary"
              >
                <AddressForm onAdd={handleAdd} />
              </ChildrenModal>
              {address.map((address, index) => (
                <AddressCard
                  key={index}
                  address={address}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onSetDefault={handleSetDefault}
                  setCartState={setCartState}
                  setSelectedAddress={setSelectedAddress}
                />
              ))}
              <div className="flex w-full justify-end">
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => setIsModalOpen(true)}
                  className="text-dash-primary hover:bg-dash-primary/20 flex h-fit items-center px-2 py-1"
                >
                  <FaPlus className="mr-1 mb-0.5" /> New Address
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// #region Card ----------------------------------------------------------------
interface AddressCardProps {
  address: Address;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  onUpdate: (data: z.infer<typeof formSchema>) => void;
  setCartState: (state: number) => void;
  setSelectedAddress: (address: Address) => void;
}
function AddressCard({
  address,
  onDelete,
  onUpdate,
  onSetDefault,
  setCartState,
  setSelectedAddress,
}: AddressCardProps) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ChildrenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={address ? "Edit Address" : "Add Address"}
        loading={loading}
        onConfirm={() => null}
        className="bg-dash-background-secondary"
      >
        <AddressForm
          address={address}
          onUpdate={onUpdate}
          onFinish={handleCloseModal}
        />
      </ChildrenModal>
      <AlertModal
        isOpen={isAlertOpen}
        loading={loading}
        onConfirm={() => onDelete(address)}
        onClose={() => setIsAlertOpen(false)}
      />
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-dash-text-primary text-sm font-semibold">
                  {address.fullName}
                </p>{" "}
                <p className="text-dash-text-secondary text-sm">
                  ({address.identification})
                </p>
                {address.default === true && (
                  <div className="bg-dash-background-tertiary text-dash-text-primary flex items-center rounded-md px-2 py-1 text-xs font-semibold">
                    Default
                  </div>
                )}
              </div>
              <div className="text-dash-text-secondary mt-3 flex max-w-[450px] flex-col gap-2 text-sm">
                <p>{address.logradouro}</p>
                <p>{`Numero:  ${address.numero}, ${address.complemento} `}</p>
                <p>{`CEP:  ${address.cep} - ${address.cidade}, ${address.estado} `}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 items-center justify-center rounded-full p-2"
                  onClick={() => onSetDefault(address)}
                >
                  <FaRegStar className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 items-center justify-center rounded-full p-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FiEdit3 className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 items-center justify-center rounded-full p-2"
                  onClick={() => setIsAlertOpen(true)}
                >
                  <LuTrash2 className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size={"sm"}
                  onClick={() => {
                    setSelectedAddress(address);
                    setCartState(2);
                  }}
                >
                  Deliver to this address
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// #endregion

// #region Form ----------------------------------------------------------------
interface AddressFormProps {
  address?: Address;
  onAdd?: (data: z.infer<typeof formSchema>) => void;
  onUpdate?: (data: z.infer<typeof formSchema>) => void;
  onFinish?: () => void;
}
function AddressForm({ address, onUpdate, onAdd, onFinish }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

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
      if (address) {
        if (address.id) {
          data.id = address.id;
        } else {
          data.id = createId();
        }

        if (onUpdate) {
          onUpdate(data);
        }
      } else if (onAdd) {
        data.id = createId();
        onAdd(data);
      } else {
        data.id = createId();
        const response = await updateUserAddress([data]);
        if (response.success) {
          console.log(response);
          update();
          toast.success(response.success);
        } else {
          throw new Error(response.error || "Unknown error");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      if (onFinish) {
        onFinish();
      }
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-6">
          {/* <div className="col-span-3 flex items-center gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                      className="flex"
                    >
                      <div className="mr-2 flex items-center space-x-2">
                        <RadioGroupItem value="Home" id="Home" />
                        <Label htmlFor="Home" className="cursor-pointer">
                          Home
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Office" id="Office" />
                        <Label htmlFor="Office" className="cursor-pointer">
                          Office
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

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
            {address ? "Update Address" : "Add Address"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// #endregion
