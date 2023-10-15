import { Web3Storage } from "web3.storage";
import axios from "axios";

const makeStorageClient = () => {
  const token = process.env.NEXT_PUBLIC_WEB3STORAGE_API_KEY;

  return new Web3Storage({ token });
};

export const fetchIpfsCid = async (cid: string) => {
  const response = axios
    .get(`https://${cid}.ipfs.w3s.link/space_data.json`)
    .then((res) => {
      return res?.data;
    })
    .catch((err: any) => {
      console.log(err, "axios");
    });

  return response;
};

export default makeStorageClient;
