"use server";

import { sendVerificationCode } from "@/lib/passwordVerification";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  console.log(email)
  const isVerified = await sendVerificationCode(email);

  if (isVerified.error) {
    return NextResponse.json(
      {
        error: "Falha ao reenviar código.",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({ success: true });
}
