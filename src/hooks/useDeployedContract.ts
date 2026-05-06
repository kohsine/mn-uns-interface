import { useQuery } from "@tanstack/react-query";
import {
  contractAddress,
  unshieldedContract,
  type DemoProviders,
} from "../lib/contract";
import { findDeployedContract } from "@midnight-ntwrk/midnight-js/contracts";

export const useDeployedContract = (providers: DemoProviders) => {
  const q = useQuery({
    queryKey: ["deployedContract"],
    queryFn: getDeployedContract,
    enabled: providers != null,
  });

  async function getDeployedContract() {
    const found = await findDeployedContract(providers!, {
      compiledContract: unshieldedContract,
      contractAddress,
    });

    return found;
  }

  return q;
};
