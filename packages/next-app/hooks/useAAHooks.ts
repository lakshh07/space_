import { IBundler, Bundler } from "@biconomy/bundler";
import { ChainId } from "@biconomy/core-types";
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";

const useAAHooks = () => {
  const bundler: IBundler = new Bundler({
    bundlerUrl: process.env.NEXT_PUBLIC_BUNDLER_URL as string,
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });

  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL as string,
  });

  return {
    bundler,
    paymaster,
    ChainId,
  };
};

export default useAAHooks;
