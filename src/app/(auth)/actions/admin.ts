"use server"

import { currentRole } from "@/app/(auth)/lib/auth"
import { UserRole } from "@prisma/client"

export const admin = async () => {
  const role = await currentRole()

  if (role === UserRole.ADMIN) {
    return { success: "Allowed Server Action!" }
  }

  return { error: "Forbidden Server Action!" }
}

/**
 * Esta função `admin` é um exemplo de action do lado do servidor.
 *
 * Ela verifica se o usuário logado possui o role de ADMIN.
 *
 * Se sim, retorna um objeto contendo uma mensagem de sucesso.
 * Se não, retorna um objeto contendo uma mensagem de erro.
 *
 * Actions do lado do servidor são usadas para acessar dados do banco de dados
 * ou realizar outras operações que não podem ser feitas no lado do cliente.
 *
 * Veja mais em: https://next-auth.js.org/advanced/server-side-actions
 */
