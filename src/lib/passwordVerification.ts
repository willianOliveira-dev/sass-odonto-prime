import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { generateCode } from "@/helpers/generateCode";

// Sistema de verificação OTP
export async function sendVerificationCode(email: string) {
  const now = new Date();
  const TWO_DAY_MS = now.getTime() + 48 * 60 * 60 * 1000;
  const code = generateCode({ length: 6 });
  const expiresAt = new Date(TWO_DAY_MS); // expira em 2 dias

  
  try {
      
    await prisma.passwordReset.updateMany({
      where: {
        email,
      },
      data: {
        used: true,
      },
    });
    
    await prisma.passwordReset.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    await sendEmail({
      to: email,
      subject: "Código de Verificação",
      code,
      htmlContext: "FORGOT",
    });

    return {
      success: true,
    };
    
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao enviar e-mail.",
    };
  }
}
