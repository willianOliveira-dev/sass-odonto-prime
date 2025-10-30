"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const verifySchema = z.object({
  email: z
    .email({ message: "E-mail é inválido." })
    .nonempty({ message: "E-mail é obrigatório." }),
  code: z
    .string()
    .length(6, { message: "Código deve haver exatamente 6 caracterers." })
    .nonempty({ message: "O código de verificação é obrigatório." }),
});

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    const schema = verifySchema.safeParse({ email, code });

    if (schema.error) {
      return NextResponse.json({
        error: schema.error.issues[0].message,
      });
    }

    const verification = await prisma.passwordReset.findFirst({
      where: {
        email,
        used: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!verification || verification.code !== code) {
      return NextResponse.json(
        {
          error: "Código inválido.",
        },
        { status: 400 },
      );
    }

    if (verification.expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: "Código expirado.",
        },
        { status: 400 },
      );
    }

    await prisma.passwordReset.update({
      where: {
        identifier: verification.identifier,
      },
      data: {
        used: true,
      },
    });

    revalidatePath("/forgot"); // refrescar o cache da página

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Falha ao verificar código de alteração de senha.",
      },
      {
        status: 500,
      },
    );
  }
}
