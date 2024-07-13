import { z } from "zod";

export const userCreateSchema = z.object({
  authUserId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const userUpdateSchema = userCreateSchema
  .omit({ authUserId: true })
  .partial();

export type userCreateSchemaDto = z.infer<typeof userCreateSchema>;
export type userUpdateSchemaDto = z.infer<typeof userUpdateSchema>;
