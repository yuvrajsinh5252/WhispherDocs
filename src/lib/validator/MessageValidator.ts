import z from "zod";

export const MessageValidator = z.object({
  fileId: z.string(),
  message: z.string(),
  model: z
    .enum(["command-a-reasoning-08-2025", "aya"])
    .optional()
    .default("command-a-reasoning-08-2025"),
});
