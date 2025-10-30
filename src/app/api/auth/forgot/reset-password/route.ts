import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const resetPassordSchema = z.object({
  email: z
    .email({ message: "E-mail é inválido." })
    .nonempty({ message: "E-mail é obrigatório." }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
      error:
        "A senha deve conter: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (!@#$%^&*).",
    })
    .nonempty({ message: "A senha é obrigatória." }),
});

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    const schema = resetPassordSchema.safeParse({
      email,
      password: newPassword,
    });

    if (schema.error) {
      return NextResponse.json(
        {
          error: schema.error.issues[0].message,
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Usuário não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    revalidatePath("/forgot");

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Falha ao redefinir senha.",
      },
      { status: 500 },
    );
  }
}
