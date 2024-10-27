import { Signer, Contract } from "ethers";
import { Provider } from "@ethersproject/providers";

export function ContractConnect(
  address: string,
  signerOrProvider: Signer | Provider,
  abi: any
) {
  return new Contract(address, abi, signerOrProvider);
}


