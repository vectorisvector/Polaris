import { Hex } from "viem";

export const handleLog = (log: string, state: string = "success") => {
  return `${new Date().toLocaleString()} ${
    state === "success" ? "✅" : state === "error" ? "❌" : ""
  } => ${log}`;
};

export const handleAddress = (address: Hex) => {
  const prefix = address.slice(0, 6);
  const suffix = address.slice(-4);
  return `${prefix}...${suffix}`;
};
