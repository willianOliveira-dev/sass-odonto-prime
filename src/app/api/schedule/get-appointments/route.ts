'use server';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
    // Buscar se tem agendamentos (appointments) em uma data específica de uma clínica.

    // parametros de rota -> http://localhost:3000?userId=1234&date=1232323
    const { searchParams } = req.nextUrl;

    const userId = searchParams.get('userId');

    const dateParam = searchParams.get('date');

    if (!userId || userId === 'null' || !dateParam || dateParam === 'null') {
        return NextResponse.json(
            {
                error: 'Nenhum agendamento encontrado.',
            },
            {
                status: 404,
            }
        );
    }
    try {
        const [year, month, day] = dateParam.split('-').map(Number);
        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const endDate = new Date(
            Date.UTC(year, month - 1, day, 23, 59, 59, 999)
        );

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: 'Clínica não encontrada.',
                },
                { status: 404 }
            );
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                userId,
                // inicio do dia até o final
                appointmentDate: {
                    // gte: Maior ou igual
                    gte: startDate,
                    //lte: Menor ou igual
                    lte: endDate,
                },
            },
            include: {
                service: true,
            },
        });

        // Montar com todos os times (slots) ocupados

        const blockedSlots = new Set<string>();

        for (let apt of appointments) {
            // Ex:
            // apt.time = "08:00"
            // apt.service.duration = 90min (1h30) -> 90 / 30
            const filledSlots: number = Math.ceil(apt.service.duration / 30); // apt.service.duration / 30 -> resultado: 3 -> Math.ceil(3) -> 4
            const startIndex = user.times.indexOf(apt.time);
            if (startIndex !== -1) {
                for (let i = 0; i < filledSlots; i++) {
                    const blockedSlot = user.times[startIndex + i];
                    if (blockedSlot) {
                        blockedSlots.add(blockedSlot);
                    }
                }
            }
        }
        const blockedTimes: string[] = Array.from(blockedSlots);

        revalidatePath(`/clinic/${userId}`);

        return NextResponse.json(blockedTimes);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                error: error,
            },
            {
                status: 500,
            }
        );
    }
}
