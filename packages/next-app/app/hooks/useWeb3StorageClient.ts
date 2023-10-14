import { Web3Storage } from "web3.storage";

const makeStorageClient = () => {
  const token = process.env.NEXT_PUBLIC_WEB3STORAGE_API_KEY;

  return new Web3Storage({ token });
};

export default makeStorageClient;
