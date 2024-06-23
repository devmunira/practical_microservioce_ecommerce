import { ActionType } from "@prisma/client";
import { z } from "zod";

export const inventoryCreateDTOSchema = z.object({
  productId: z.string(),
  sku: z.string(),
  quantity: z.number().int().optional().default(0),
});

export const updateInventoryDTOShcema = z.object({
  quantity: z.number().int(),
  actionType: z.nativeEnum(ActionType),
});

export type InventoryCreateDTO = z.infer<typeof inventoryCreateDTOSchema>;
export type InventoryUpdateDTO = z.infer<typeof updateInventoryDTOShcema>;
