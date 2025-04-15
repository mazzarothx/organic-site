"use server";

import bcrypt from "bcryptjs";
import type * as z from "zod";

import { getUserByEmail } from "@/app/(auth)/data/user";
import { db } from "@/app/(auth)/lib/db";
import { sendVerificationEmail } from "@/app/(auth)/lib/mail";
import { generateVerificationToken } from "@/app/(auth)/lib/tokens";
import { RegisterSchema } from "@/app/(auth)/schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}

	const { email, password, name } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: "Email already in use!" };
	}

	await db.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	const verificationToken = await generateVerificationToken(email);
	await sendVerificationEmail(verificationToken.email, verificationToken.token);

	return { success: "Confirmation email sent!" };
};
