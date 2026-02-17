import { z } from "zod";

function isAdult(dateString) {
  const birthDate = new Date(dateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
}

export const registrationSchema = z.object({
  fullName: z.string().min(1, "ПІБ обовʼязкове"),
  email: z.string().email("Некоректний email"),
  birthDate: z
    .string()
    .min(1, "Дата народження обовʼязкова")
    .refine(isAdult, {
      message: "Вік має бути не менше 18 років",
    }),
  source: z.enum(["social", "friends", "self"], {
    errorMap: () => ({
      message: "Оберіть один із варіантів: «Соціальні мережі», «Друзі» або «Самостійно»",
    }),
  }),
});

