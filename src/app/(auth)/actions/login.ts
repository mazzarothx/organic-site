"use server";

import { AuthError } from "next-auth";
import type * as z from "zod";

import { signIn } from "@/app/(auth)/auth";
import { getTwoFactorConfirmationByUserId } from "@/app/(auth)/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/app/(auth)/data/two-factor-token";
import { getUserByEmail } from "@/app/(auth)/data/user";
import { db } from "@/app/(auth)/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/app/(auth)/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/app/(auth)/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/app/(auth)/routes";
import { LoginSchema } from "@/app/(auth)/schemas";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}

	const { email, password, code } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: "Email does not exist!" };
	}

	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(existingUser.email);

		await sendVerificationEmail(verificationToken.email, verificationToken.token);

		return { success: "Confirmation email sent!" };
	}

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			if (!twoFactorToken) {
				return { error: "Invalid code!" };
			}

			if (twoFactorToken.token !== code) {
				return { error: "Invalid code!" };
			}

			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) {
				return { error: "Code expired!" };
			}

			await db.twoFactorToken.delete({
				where: { id: twoFactorToken.id },
			});

			const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

			if (existingConfirmation) {
				await db.twoFactorConfirmation.delete({
					where: { id: existingConfirmation.id },
				});
			}

			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			});
		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);
			await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

			return { twoFactor: true };
		}
	}

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials!" };
				default:
					return { error: "Something went wrong!" };
			}
		}

		throw error;
	}
};

/**
 * Esta função `login` é responsável por lidar com o login do usuário.
 *
 * Ela primeiro verifica se o usuário existe no banco de dados e se a senha
 * está correta. Depois disso, ela verifica se o usuário possui autenticação
 * de dois fatores ativada.
 *
 * Se a autenticação de dois fatores estiver ativada, ela gera um token único
 * para o usuário e o envia por email. Em seguida, ela cria um registro no banco
 * de dados para confirmar a autenticação de dois fatores.
 *
 * Se a autenticação de dois fatores não estiver ativada, ela gera um token único
 * para o usuário e o envia por email. Em seguida, ela redireciona o usuário para
 * a página de autenticação de dois fatores.
 *
 * Se tudo ocorrer bem, a função faz o login do usuário usando o pacote `next-auth`.
 *
 * Se o login falhar, a função retorna uma mensagem de erro.
 *
 * @param {Object} values - Um objeto contendo os campos de login (email e senha).
 * @param {string} [callbackUrl] - Uma string opcional que representa a URL de redirecionamento após o login.
 * @return {Promise<Object>} Um objeto contendo informações sobre o resultado do login.
 */
