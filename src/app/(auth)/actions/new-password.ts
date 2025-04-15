"use server";

import bcrypt from "bcryptjs";
import type * as z from "zod";

import { getPasswordResetTokenByToken } from "@/app/(auth)/data/password-reset-token";
import { getUserByEmail } from "@/app/(auth)/data/user";
import { db } from "@/app/(auth)/lib/db";
import { NewPasswordSchema } from "@/app/(auth)/schemas";

export const newPassword = async (
	values: z.infer<typeof NewPasswordSchema>,
	token?: string | null,
) => {
	if (!token) {
		return { error: "Missing token!" };
	}

	const validatedFields = NewPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}

	const { password } = validatedFields.data;

	const existingToken = await getPasswordResetTokenByToken(token);

	if (!existingToken) {
		return { error: "Invalid token!" };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return { error: "Token has expired!" };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: "Email does not exist!" };
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await db.user.update({
		where: { id: existingUser.id },
		data: { password: hashedPassword },
	});

	await db.passwordResetToken.delete({
		where: { id: existingToken.id },
	});

	return { success: "Password updated!" };
};

/**
 * Esta função `newPassword` é responsável por atualizar a senha de um usuário.
 * Ela recebe os valores de um formulário de redefinição de senha e um token.
 *
 * Primeiro, ela valida os campos do formulário de acordo com uma schema definida em `src/schemas/new-password.ts`.
 * Se algum campo estiver inválido, ela retorna uma mensagem de erro.
 *
 * Depois, ela verifica se o token é válido e não expirou.
 * Se o token não for válido ou expirou, ela retorna uma mensagem de erro.
 *
 * Em seguida, ela verifica se o email do token existe em um usuário do banco de dados.
 * Se o email não existir, ela retorna uma mensagem de erro.
 *
 * Em seguida, ela gera uma nova senha criptografada e atualiza a senha do usuário no banco de dados.
 *
 * Por fim, ela exclui o token de redefinição de senha do banco de dados.
 *
 * Se tudo ocorrer bem, ela retorna uma mensagem de sucesso.
 */
