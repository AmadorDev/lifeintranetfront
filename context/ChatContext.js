import { createContext } from "react";
const ChatContext = createContext({
  chat: undefined,
  chatbox: () => null,
});

export default ChatContext;
