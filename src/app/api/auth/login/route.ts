"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginActionCredentials } from "@/app/(auth)/(login)/_actions/loginActionCredentials";
import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return NextResponse.json(
      { error: "Email não encontrado." },
      { status: 404 },
    );

  if (!user.password)
    return NextResponse.json(
      {
        error:
          "Usuário sem senha cadastrada. Defina uma senha para continuar ou acesse diretamente com sua conta Google ou Facebook.",
      },
      { status: 400 },
    );

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid)
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });

  try {
    await loginActionCredentials(email, password);

    revalidatePath("/login");

    return NextResponse.json(
      {
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Falha ao efetuar login. Tente novamente mais tarde.",
      },
      {
        status: 500,
      },
    );
  }
}
