"use client";

import { useCurrentUser } from "@/app/(auth)/hooks/use-current-user";
import { FloatingInput } from "@/components/input-floating";
import ProfileImageUpload from "@/components/profile-image-upload";
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
import * as z from "zod";

const UserDetailsSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  image: z.string().optional(),
});

const Details = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof UserDetailsSchema>>({
    resolver: zodResolver(UserDetailsSchema),
    defaultValues: {
      name: user?.name || undefined,
      lastName: user?.lastName || undefined,
      email: user?.email || undefined,
      phone: user?.phone || undefined,
    },
  });

  return (
    <div>
      <Form {...form}>
        <form>
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ProfileImageUpload
                        value={field.value ? [field.value] : []}
                        disabled={loading}
                        onChange={(url) => {
                          form.setValue("image", url);
                        }}
                        onRemove={() => {
                          form.setValue("image", "");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
        </form>
      </Form>
    </div>
  );
};

export default Details;
