import z from "zod";
import { GROQ_MODELS } from "@/lib/message-api/constants";

const modelIds = Object.keys(GROQ_MODELS) as [string, ...string[]];

export const MessageValidator = z.object({
  fileId: z.string(),
  message: z.string(),
  model: z.enum(modelIds).optional().default("llama-3.3-70b-versatile"),
});
