"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter no mínimo 2 caracteres." })
    .max(150, { message: "O nome deve ter no máximo 150 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
      message:
        "A senha deve conter letra maiúscula, minúscula, número e símbolo.",
    }),
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    const schema = registerSchema.safeParse({ name, email, password });
    if (!schema.success) {
      return NextResponse.json(
        { error: schema.error.issues[0].message },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "E-mail já cadastrado." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true },
    });

    revalidatePath("/register");

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Falha ao registrar usuário." },
      { status: 500 },
    );
  }
}
