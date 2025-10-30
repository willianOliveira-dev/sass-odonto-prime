"use server";
import prisma from "@/lib/prisma";
import getSession from "@/lib/getSession";
import { revalidatePath } from "next/cache";

export async function deleteAccount() {
  const session = await getSession();

  if (!session?.user) {
    return {
      error: "Usuário não encontrado",
    };
  }

  const userId = session.user.id;

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    revalidatePath("/dashboard/profile"); // refrescar o cache da página

    return {
      data: "Clínica deletada com sucesso!",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao deletar usuário.",
    };
  }
}
