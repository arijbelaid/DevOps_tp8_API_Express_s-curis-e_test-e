import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom est trop long"),
  email: z.string().trim().email("Format d'email invalide").max(254, "L'email est trop long"),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(2000, "Le message est trop long")
}).strict("Champs non autorisés"); 
// .strict() empêche le mass assignment (rejette les champs non déclarés comme "role": "admin")
