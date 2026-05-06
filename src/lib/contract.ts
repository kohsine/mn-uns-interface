import {
  CompiledContract,
  ProvableCircuitId,
} from "@midnight-ntwrk/compact-js";
import * as CompiledOutput from "../compiled/contract";
import type { MidnightProviders } from "@midnight-ntwrk/midnight-js/types";

export const contractAddress =
  "92d7c113eefb2958d57abad23d7d66fe015c708bf32c53972c07d3ba5e97bab3";

export const unshieldedContract =
  CompiledContract.make<CompiledOutput.Contract>(
    "unshielded-token",
    CompiledOutput.Contract,
  ).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets("./compiled"),
  );

export type DemoContract = CompiledOutput.Contract<undefined>;

export type DemoCircuits = ProvableCircuitId<DemoContract>;

export type DemoProviders = MidnightProviders<DemoCircuits>;
