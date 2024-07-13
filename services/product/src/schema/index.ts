import { Status } from "@prisma/client";
import { z } from "zod";

export const productCreateDTOSchema = z.object({
  title: z.string().min(10).max(255),
  sku: z.string().min(3).max(10),
  description: z.string().max(1000).optional(),
  price: z.number().optional().default(0),
  status: z.nativeEnum(Status).optional().default(Status.DRAFT),
});

export const productUpdateDTOSchema = productCreateDTOSchema.partial();

export type productCreateDTO = z.infer<typeof productCreateDTOSchema>;
export type productUpdateDTO = z.infer<typeof productUpdateDTOSchema>;
