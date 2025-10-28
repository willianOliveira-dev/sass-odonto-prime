"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome é obrigatório." })
    .min(2, { message: "O nome deve ter no mínimo 2 caracteres." })
    .max(150, { message: "O nome deve ter no máximo 150 caracteres." }),
  email: z.email({ message: "O email é inválido." }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
      error: "A senha não condiz com os requisitos.",
    }),
});

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  const schema = registerSchema.safeParse({ name, email, password });

  if (schema.error) {
    return NextResponse.json({
      error: schema.error.issues[0].message,
    });
  }

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Preencha todos os campos." },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json({ error: "Email já em uso." }, { status: 400 });
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    revalidatePath("/register");

    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Falha ao registrar usuário. Tente novamente mais tarde.",
      },
      {
        status: 500,
      },
    );
  }
}
