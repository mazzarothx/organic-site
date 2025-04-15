import * as z from "zod";
import { UserRole } from "@prisma/client";

export const UserGeneralSchema = z.object({
  name: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  about: z.string().optional(),
});

export const UserAddressSchema = z
  .object({
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
  })
  .array();

export const UpdatePasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirmation password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The passwords don't match!",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "The new password cannot be the same as the old password!",
    path: ["newPassword"],
  });

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),

    lastName: z.optional(z.string()),
    phone: z.optional(z.string()),
    address: z.optional(z.string()),
    country: z.optional(z.string()),
    state: z.optional(z.string()),
    city: z.optional(z.string()),
    zipCode: z.optional(z.string()),
    about: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );

export const ImageProfileSchema = z.object({
  image: z.string(),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  confirmPassword: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});
