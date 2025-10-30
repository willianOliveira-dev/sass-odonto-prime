import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const GET = async (req: Request) => {
  // Pega a sessão do usuário
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 },
    );
  }

  const clinicId = session.user.id;

  const url = new URL(req.url);
  const dateString = url.searchParams.get("date");

  if (!dateString) {
    return NextResponse.json(
      { error: "Data não informada." },
      { status: 400 },
    );
  }

  if (!clinicId) {
    return NextResponse.json(
      { error: "Usuário não encontrado." },
      { status: 404 },
    );
  }

  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { service: true },
    });

    revalidatePath("/dashboard");
    return NextResponse.json(appointments);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Falha ao buscar agendamentos." },
      { status: 500 },
    );
  }
};
