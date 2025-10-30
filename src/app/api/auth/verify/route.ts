"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json();

    const verification = await prisma.otpVerification.findFirst({
      where: { userId, used: false },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!verification || verification.code !== code) {
      return NextResponse.json({ error: "Código inválido." }, { status: 400 });
    }

    if (verification.expiresAt < new Date()) {
      return NextResponse.json({ error: "Código Expirado." }, { status: 400 });
    }

    await prisma.otpVerification.update({
      where: { identifier: verification.identifier },
      data: { used: true },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    revalidatePath("/verify"); // refrescar o cache da página

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Falha ao verificar código de autenticação.",
      },
      {
        status: 500,
      },
    );
  }
}
