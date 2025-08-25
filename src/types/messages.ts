import { AppRouter } from "@/server";
import { inferRouterOutputs } from "@trpc/server";

type RuoterOutput = inferRouterOutputs<AppRouter>;
type Messages = RuoterOutput["getMessages"]["messages"];
type OmitText = Omit<Messages[number], "text">;
type ExtendedText = {
  text: string | JSX.Element;
  thinking?: string | null;
  hasThinking?: boolean;
};

export type ExtendedMessages = OmitText & ExtendedText;
