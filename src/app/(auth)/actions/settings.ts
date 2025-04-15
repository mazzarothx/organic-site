"use server";

import bcrypt from "bcryptjs";
import type * as z from "zod";

import { unstable_update } from "@/app/(auth)/auth";
import { getUserByEmail, getUserById } from "@/app/(auth)/data/user";
import { currentUser } from "@/app/(auth)/lib/auth";
import { db } from "@/app/(auth)/lib/db";
import { sendVerificationEmail } from "@/app/(auth)/lib/mail";
import { generateVerificationToken } from "@/app/(auth)/lib/tokens";
import type {
  ImageProfileSchema,
  SettingsSchema,
  UpdatePasswordSchema,
  UserAddressSchema,
  UserGeneralSchema,
} from "@/app/(auth)/schemas";

export const updateUserGeneral = async (
  values: z.infer<typeof UserGeneralSchema>,
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  unstable_update({
    user: {
      name: updatedUser.name,
    },
  });

  return {
    success: "Information updated successfully!",
  };
};

export const updateUserAddress = async (
  values: z.infer<typeof UserAddressSchema>,
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      address: values,
    },
  });

  const addressJson = JSON.stringify(updatedUser.address);

  return {
    success: "Address updated successfully!",
  };
};

export const updateUserImage = async (
  values: z.infer<typeof ImageProfileSchema>,
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      image: values.image,
    },
  });

  unstable_update({
    user: {
      image: updatedUser.image,
    },
  });

  return {
    success: "Image updated successfully!",
  };
};

export const updateUserPassword = async (
  values: z.infer<typeof UpdatePasswordSchema>,
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    await db.user.update({
      where: { id: dbUser.id },
      data: {
        password: hashedPassword,
      },
    });

    return { success: "Password updated successfully!" };
  } else {
    return { error: "Something went wrong!" };
  }
};

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  unstable_update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    },
  });

  return { success: "Settings Updated!" };
};
