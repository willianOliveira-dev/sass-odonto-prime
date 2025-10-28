"use server";
import prisma from "@/lib/prisma";

export async function getProfessionals() {
  try {
    const professionalsWithaoutPassword = (
      await prisma.user.findMany({
        where: {
          status: true,
        },
        include: {
          subscription: true,
        },
      })
    ).map((professional) => {
      const { password, ...rest } = professional;
      return rest;
    });

    return professionalsWithaoutPassword;
  } catch (error) {
    console.log(error);
    return [];
  }
}
