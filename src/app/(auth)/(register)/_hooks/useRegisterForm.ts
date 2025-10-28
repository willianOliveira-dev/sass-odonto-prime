import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "O nome é obrigatório." })
    .min(2, { message: "O nome deve ter no mínimo 2 caracteres." })
    .max(150, { message: "O nome deve ter no máximo 150 caracteres." }),
  email: z.email({ message: "O e-mail é inválido." }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {
      error: "A senha não condiz com os requisitos.",
    })
    .nonempty({ message: "A senha é obrigatória." }),
});

export type RegisterFormProps = z.infer<typeof registerSchema>;

export function useRegisterForm() {
  return useForm<RegisterFormProps>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
}
