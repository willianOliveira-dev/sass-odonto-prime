import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { type NextAuthRequest } from "next-auth";
/*
 Rota para buscar todos os agendamentos de uma clínica específica.

> Preciso ter a data
> Preciso ter o id da clinica  (NÃO POSSO RECEBER DA REQUISIÇÃO req.params)
 */

export const GET = auth(async (req: NextAuthRequest) => {
  if (!req.auth)
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      {
        status: 401,
      },
    );

  const { searchParams } = req.nextUrl;

  const dateString = searchParams.get("date");
  const clinicId = req.auth.user.id;

  if (!dateString) {
    return NextResponse.json(
      {
        error: "Data não informada.",
      },
      {
        status: 400,
      },
    );
  }

  if (!clinicId)
    return NextResponse.json(
      { error: "Usuário não encontrado." },
      {
        status: 404,
      },
    );

  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
        // inicio do dia até o final
        appointmentDate: {
          // Maior ou igual
          gte: startDate,
          // Menor ou igual
          lte: endDate,
        },
      },
      include: {
        service: true,
      },
    });

    revalidatePath("/dashboard");
    return NextResponse.json(appointments);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Falha ao buscar agendamentos.",
      },
      {
        status: 500,
      },
    );
  }
});
