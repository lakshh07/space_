import { ethersProvider } from "@/utils/rainbowConfig";
import { ethers } from "ethers";
import abi from "@/utils/abi.json";
import {
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster";
import toast from "react-hot-toast";
import { BiconomySmartAccountV2 } from "@biconomy/account";

type useAccountAbstractionProps = {
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  transactionData: ethers.PopulatedTransaction;
  smartAccount: BiconomySmartAccountV2 | undefined;
};

const spaceContractAddress = "0xC715299A729f9E4d2bb9239D39515Eb0996e7BD7";

export const contract = new ethers.Contract(
  spaceContractAddress,
  abi,
  ethersProvider
);

const useAccountAbstraction = async ({
  setDisabled,
  setLoading,
  transactionData,
  smartAccount,
}: useAccountAbstractionProps) => {
  const toastId = toast.loading("Transaction logging...");
  try {
    setLoading(true);
    setDisabled(true);

    const minTx = transactionData;

    console.log(minTx.data);
    const tx1 = {
      to: spaceContractAddress,
      data: minTx.data,
    };

    let userOp = await smartAccount?.buildUserOp([tx1]);
    console.log({ userOp });

    const biconomyPaymaster =
      smartAccount?.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
    let paymasterServiceData: SponsorUserOperationDto = {
      mode: PaymasterMode.SPONSORED,
      smartAccountInfo: {
        name: "BICONOMY",
        version: "2.0.0",
      },
    };

    if (userOp) {
      toast.loading("Transaction sent to paymaster...", {
        id: toastId,
      });

      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );

      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount?.sendUserOp(userOp);

      toast.loading("Paying gas fees...", {
        id: toastId,
      });
      console.log("userOpHash", userOpResponse);

      if (userOpResponse) {
        const { receipt } = await userOpResponse.wait(1);

        toast.success(
          `Transaction successfull with txHash ${receipt.transactionHash}`,
          {
            id: toastId,
            duration: 3000,
          }
        );
        setLoading(false);
        setDisabled(false);
        console.log("txHash", receipt.transactionHash);
      }
    }
  } catch (err: any) {
    console.error(err);
    toast.error(err, {
      id: toastId,
    });
    console.log(err);
  }
};

export default useAccountAbstraction;
