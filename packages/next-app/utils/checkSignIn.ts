import toast from "react-hot-toast";

export const checkSignIn = (address: string | undefined) => {
  !address && toast.error("SignIn required.");

  return address ? true : false;
};
