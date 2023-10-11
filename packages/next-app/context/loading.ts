import { createContext, useContext } from "react";

export type LoadingContextProps = {
  mainLoading: boolean;
  setMainLoading: (e: boolean) => void;
};

const LoadingContext = createContext<LoadingContextProps>({
  mainLoading: false,
  setMainLoading: () => {},
});

export function useLoadingContext() {
  return useContext(LoadingContext);
}

export default LoadingContext;
