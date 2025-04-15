"use server";

import { signOut } from "@/app/(auth)/auth";

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
