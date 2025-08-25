import { z } from "zod";
import { ALL_MODELS } from "@/lib/message-api/constants";

const modelIds = Object.keys(ALL_MODELS) as [string, ...string[]];

export const MessageValidator = z.object({
  fileId: z.string(),
  message: z.string(),
  model: z.enum(modelIds).optional().default("llama-3.3-70b-versatile"),
});
