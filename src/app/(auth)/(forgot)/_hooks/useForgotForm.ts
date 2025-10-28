import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const forgotSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "E-mail é obrigatório" })
    .email({ message: "E-mail é inválido" }),
});

export type ForgotFormProps = z.infer<typeof forgotSchema>;

export function useForgotForm() {
  return useForm<ForgotFormProps>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });
}
