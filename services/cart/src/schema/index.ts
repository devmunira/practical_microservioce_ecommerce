import { z } from "zod";

export const addToCartSchema = z.object({
  inventoryId: z.string(),
  productId: z.string(),
  quantity: z.number(),
});

export type addToCartSchemaDto = z.infer<typeof addToCartSchema>;
