import { z } from "zod";

export const EmailSendingSchema = z.object({
  recipient: z.string().email(),
  sender: z.string().email().optional(),
  body: z.string(),
  source: z.string(),
  subject: z.string(),
});

export type emailSendingSchemaDto = z.infer<typeof EmailSendingSchema>;
