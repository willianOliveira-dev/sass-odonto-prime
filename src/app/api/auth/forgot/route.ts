"use server";

import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { sendVerificationCode } from "@/lib/passwordVerification";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({
      error: "E-mail não informado.",
    });
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

  const isVerified = await sendVerificationCode(email);

  if (isVerified.error) {
    return NextResponse.json(
      {
        error: "Falha ao enviar e-mail",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({ success: true });
}
