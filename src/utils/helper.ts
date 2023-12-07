import { Hex } from "viem";

/**
 * Handles logging with timestamp and state indicator.
 * @param log - The log message.
 * @param state - The state of the log. Default value is "success".
 * @returns The formatted log message with timestamp and state indicator.
 */
export const handleLog = (log: string, state: string = "success") => {
  return `${new Date().toLocaleString()} ${
    state === "success" ? "✅" : state === "error" ? "❌" : ""
  } => ${log}`;
};

/**
 * Handles the address by extracting the prefix and suffix.
 * @param address - The address to be handled.
 * @returns The formatted address with the prefix and suffix.
 */
export const handleAddress = (address: Hex) => {
  const prefix = address.slice(0, 6);
  const suffix = address.slice(-4);
  return `${prefix}...${suffix}`;
};

/**
 * Converts a Uint8Array to a hexadecimal string.
 *
 * @param uint8arr - The Uint8Array to convert.
 * @returns The hexadecimal string representation of the Uint8Array.
 */
export function uint8ToHex(uint8arr: Uint8Array) {
  let hexStr = "";
  for (let i = 0; i < uint8arr.length; i++) {
    let hex = uint8arr[i].toString(16);
    hex = hex.length === 1 ? "0" + hex : hex;
    hexStr += hex;
  }
  return ("0x" + hexStr) as `0x${string}`;
}

/**
 * Converts a string to its hexadecimal representation.
 *
 * @param str - The string to convert.
 * @returns The hexadecimal representation of the string.
 */
export function stringToHex(str: string) {
  let encoder = new TextEncoder();
  let view = encoder.encode(str);
  return uint8ToHex(view);
}

/**
 * Suspends the execution of the current function for a specified time.
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified time has elapsed.
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
