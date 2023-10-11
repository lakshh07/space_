"use client";

import React, { useState } from "react";
import { ParticleAuthModule, ParticleProvider } from "@biconomy/particle-auth";
import { ethers } from "ethers";
import { Button, Container, Heading } from "@chakra-ui/react";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { ChainId } from "@biconomy/core-types";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import { BiconomySmartAccount } from "@biconomy/account";
import abi from "@/utils/abi.json";
import { PolygonMumbai } from "@particle-network/chains";
import { useSmartAccountContext } from "@/context/userAccount";
import { ethersProvider } from "@/utils/rainbowConfig";

const spaceContractAddress = "0xC715299A729f9E4d2bb9239D39515Eb0996e7BD7";

const particle = new ParticleAuthModule.ParticleNetwork({
  projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECTID || "",
  clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENTKEY || "",
  appId: process.env.NEXT_PUBLIC_PARTICLE_APPID || "",
  wallet: {
    displayWalletEntry: true,
    defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.BR,
    supportChains: [
      { id: 80001, name: "PolygonMumbai" },
      { id: 137, name: "Polygon" },
    ],
  },
  chainName: PolygonMumbai.name,
  chainId: PolygonMumbai.id,
});

const logout = () => {
  particle.auth.logout().then(() => {
    console.log("logout");
  });
};

const bundler: IBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/80001/K2Ckj7gyT.d20dac0e-2a0b-42db-bc5f-9e6ac093a955",
});

export const ProfileClient: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2>();
  // const [provider, setProvider] = useState<ethers.providers.Provider>();
  const { smartAccount } = useSmartAccountContext();

  // const connect = async () => {
  //   try {
  //     setLoading(true);
  //     const userInfo = await particle.auth.login();
  //     console.log("Logged in user:", userInfo);
  //     const particleProvider = new ParticleProvider(particle.auth);
  //     const web3Provider = new ethers.providers.Web3Provider(
  //       particleProvider,
  //       "any"
  //     );
  //     setProvider(web3Provider);

  //     const module = await ECDSAOwnershipValidationModule.create({
  //       signer: web3Provider.getSigner(),
  //       moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
  //     });

  //     let biconomySmartAccount = await BiconomySmartAccountV2.create({
  //       chainId: ChainId.POLYGON_MUMBAI,
  //       bundler: bundler,
  //       paymaster: paymaster,
  //       entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  //       defaultValidationModule: module,
  //       activeValidationModule: module,
  //     });
  //     setAddress(await biconomySmartAccount.getAccountAddress());
  //     setSmartAccount(biconomySmartAccount);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleMint = async () => {
    const contract = new ethers.Contract(
      spaceContractAddress,
      abi,
      ethersProvider
    );
    try {
      const minTx = await contract.populateTransaction.createQuest(
        "id2",
        "metadata2",
        1,
        15
      );
      // const minTx = await contract.populateTransaction.questComplete(
      //   1,
      //   "0xc632F549D5107C32B9FF47937DAB11008b1e2636",
      //   {
      //     value: ethers.utils.parseEther("0.01"),
      //   }
      // );
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
        const paymasterAndDataResponse =
          await biconomyPaymaster.getPaymasterAndData(
            userOp,
            paymasterServiceData
          );

        userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
        const userOpResponse = await smartAccount?.sendUserOp(userOp);
        console.log("userOpHash", userOpResponse);
        if (userOpResponse) {
          const { receipt } = await userOpResponse.wait(1);
          console.log("txHash", receipt.transactionHash);
        }
      }
    } catch (err: any) {
      console.error(err);
      console.log(err);
    }
  };

  return (
    <Container my={"4rem"} maxW={"1200px"}>
      <Heading>Testing account abstraction - Gasless Transaction</Heading>
      {/* 
      {!loading && !address && (
        <Button >Connect particle wallet</Button>
      )}
      {loading && <p>Loading Smart Account...</p>}
      {address && <h2>Smart Account: {address}</h2>} */}

      <Button onClick={handleMint}>Transaction</Button>
      <Button onClick={logout}>Logout</Button>
      {/* <Button onClick={handleMint}>Transaction</Button> */}
    </Container>
  );
};
