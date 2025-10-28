import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const resetPasswordForm = z
  .object({
    password: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
        error:
          "A senha deve conter: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (!@#$%^&*).",
      })
      .nonempty({ message: "A senha é obrigatória." }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Este campo é obrigatório." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"], // Indica qual campo do objeto deve receber o erro
  });

export type ResetPasswordFormProps = z.infer<typeof resetPasswordForm>;

export function useResetPasswordForm() {
  return useForm<ResetPasswordFormProps>({
    resolver: zodResolver(resetPasswordForm),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
}
