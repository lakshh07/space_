import { createContext, useContext } from "react";
import { BiconomySmartAccountV2 } from "@biconomy/account";

export type SmartAccountContextProps = {
  smartAccount: BiconomySmartAccountV2 | undefined;
  setSmartAccount: (c: BiconomySmartAccountV2) => void;
};

const SmartAccountContext = createContext<SmartAccountContextProps>({
  smartAccount: undefined,
  setSmartAccount: () => {},
});

export function useSmartAccountContext() {
  return useContext(SmartAccountContext);
}

export default SmartAccountContext;
