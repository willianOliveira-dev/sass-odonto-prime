"use server";
import { NextResponse, type NextRequest } from "next/server";
import { sendVerificationCode } from "@/lib/emailVerification";

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json();
    const isVerified = await sendVerificationCode(userId, email);

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
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Falha ao reenviar código." },
      { status: 500 },
    );
  }
}
