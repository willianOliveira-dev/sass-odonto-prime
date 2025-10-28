"use server";
import path from "path";
import nodemailer from "nodemailer";

interface SendEmailProps {
  to: string;
  subject: string;
  code: string;
  text?: string;
  htmlContext: "OTP" | "FORGOT";
}

const htmlRendering = (htmlContext: "OTP" | "FORGOT", code: string, to: string) => {
  const logoCid = "logoOdonto";

  if (htmlContext === "OTP") {
    return `<div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
      <div style="max-width: 400px; margin: auto; background: white; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <img src="cid:${logoCid}" alt="Logo OdontoPrime" style="width: 120px; margin-bottom: 20px;" />
        <h2 style="color: #2c3e50; margin-bottom: 10px;">Vamos confirmar seu login</h2>
        <p style="font-size: 16px; color: #555; margin-bottom: 25px;">
          Use este código para fazer login na OdontoPrime
        </p>
        <div style="font-size: 28px; font-weight: bold; color: #155dfc; margin: 15px 0;">${code}</div>
        <p style="color: #888; font-size: 14px; margin-bottom: 25px;">Este código expira em 10 minutos</p>
        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Este código fará login seguro usando seu e-mail</p>
        <div style="padding: 10px; margin-bottom: 20px;"><span style="color: #333; font-weight: bold;">${to}</span></div>
        <p style="color: #999; font-size: 12px;">Se você não solicitou este e-mail, pode ignorá-lo com segurança.</p>
      </div>
    </div>`;
  }

  return `<div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
    <div style="max-width: 400px; margin: auto; background: white; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <img src="cid:${logoCid}" alt="Logo OdontoPrime" style="width: 120px; margin-bottom: 20px;" />
      <h2 style="color: #2c3e50; margin-bottom: 10px;">Redefinir sua senha</h2>
      <p style="font-size: 16px; color: #555; margin-bottom: 25px;">Recebemos uma solicitação para redefinir sua senha na OdontoPrime.</p>
      <div style="font-size: 28px; font-weight: bold; color: #155dfc; margin: 15px 0;">${code}</div>
      <p style="color: #888; font-size: 14px; margin-bottom: 25px;">Este código expira em 2 dias</p>
      <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Use este código para redefinir sua senha com segurança</p>
      <div style="padding: 10px; margin-bottom: 20px;"><span style="color: #333; font-weight: bold;">${to}</span></div>
      <p style="color: #999; font-size: 12px;">Se você não solicitou esta alteração, pode ignorar este e-mail com segurança.</p>
    </div>
  </div>`;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, text, htmlContext, code }: SendEmailProps) {
  const emailHtml = htmlRendering(htmlContext, code, to);

  const logoPath = path.join(process.cwd(), "public/logo-odonto.png");

  try {
    const info = await transporter.sendMail({
      from: `"OdontoPrime" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: emailHtml,
      attachments: [
        {
          filename: "logo-odonto.png",
          path: logoPath,
          cid: "logoOdonto",
          contentDisposition: "inline",
        },
      ],
    });

    return info;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw new Error("Falha ao enviar e-mail");
  }
}
