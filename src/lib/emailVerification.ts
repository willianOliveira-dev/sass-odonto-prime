import prisma from "./prisma";
import { sendEmail } from "./mailer";
import { generateCode } from "@/helpers/generateCode";

// Sistema de verificação OTP 
export async function sendVerificationCode(userId: string, email: string) {
  const now = Date.now();
  const TEN_MINUTES_MS = now + 600 * 1000;
  const code: string = generateCode({ length: 6 });
  const expiresAt = new Date(TEN_MINUTES_MS); // expira em 10 minutos

  try {
    await prisma.otpVerification.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });

    await sendEmail({
      to: email,
      subject: "Código de Verificação",
      code,
      htmlContext: "OTP",
    });

    return {
      success: true,
    };
    
  } catch (error) {
    console.log(error);
    
    return {
      error: "Falha ao enviar e-mail",
    };
  }
}
