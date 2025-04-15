"use client";

import * as z from "zod";

import { useCurrentUser } from "@/app/(auth)/hooks/use-current-user";
import { FloatingInput } from "@/components/input-floating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().min(2),
  phone: z.string().optional(),
  image: z.string().optional(),
});

const passwordSchema = z.object({
  password: z.string().min(2),
  newPassword: z.string().min(2),
  confirmPassword: z.string().min(2),
});

const DetailsClient = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || undefined,
      lastName: user?.lastName || undefined,
      email: user?.email || undefined,
      phone: user?.phone || undefined,
      image: user?.image || undefined,
    },
  });

  return (
    <Card className="w-full">
      <CardContent>
        <Form {...form}>
          <form
            className="w-full space-y-5 pt-6"
            // onSubmit={form.handleSubmit(onSubmit)}
            // onChange={() => setIsModified(true)}
          >
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        label="First Name"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        label="Last Name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        label="Email Address"
                        {...field}
                        disabled={user?.email != undefined || loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        label="Phone Number"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Button type="submit" disabled={!isModified || loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DetailsClient;
