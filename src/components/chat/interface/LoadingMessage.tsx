import { Loader } from "./Loader";

export const loadingMessage = {
  createdAt: new Date().toISOString(),
  id: "loading-message",
  isUserMessage: false,
  hasThinking: false,
  text: <Loader />,
};
