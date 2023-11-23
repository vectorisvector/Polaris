"use client";

import classNames from "classnames";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  Hex,
  PrivateKeyAccount,
  TransactionExecutionError,
  createWalletClient,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { handleAddress, handleLog } from "../../utils/helper";
import { base } from "viem/chains";
import frenPetAbi from "@/abis/frenpet";
import { parseEther } from "viem/utils";

export default function FrenPet() {
  const [accounts, setAccounts] = useState<PrivateKeyAccount[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [fee, setFee] = useState<number>(0);
  const [fromId, setFromId] = useState<number>();
  const [toId, setToId] = useState<number>();

  const run = useCallback(async () => {
    if (accounts.length === 0) {
      setLogs((logs) => [handleLog("没有私钥", "error"), ...logs]);
      return;
    }

    if (!fromId) {
      setLogs((logs) => [handleLog("没有 fromId", "error"), ...logs]);
      return;
    }

    if (!toId) {
      setLogs((logs) => [handleLog("没有 toId", "error"), ...logs]);
      return;
    }

    const walletClient = createWalletClient({
      chain: base,
      transport: http(),
    });

    for (const account of accounts) {
      try {
        const hash = await walletClient.writeContract({
          account,
          address: "0x144ba2bd6dae469fb11c0d8a8e79b083c985ca73",
          abi: frenPetAbi,
          functionName: "attack",
          maxPriorityFeePerGas: BigInt(fee),
          args: [BigInt(fromId), BigInt(toId)],
          value: parseEther("0.00005"),
        });
        setLogs((logs) => [
          handleLog(`${handleAddress(account.address)} ${hash}`, "success"),
          ...logs,
        ]);
      } catch (error: any) {
        const err = error as TransactionExecutionError;
        setLogs((logs) => [
          handleLog(
            `${handleAddress(account.address)} ${err.details}`,
            "error",
          ),
          ...logs,
        ]);
      }
    }
  }, [accounts, fee, fromId, toId]);

  return (
    <main className=" flex flex-col items-center gap-5 py-5">
      <h1 className=" text-5xl">FrenPet</h1>

      <div className=" flex items-center gap-2">
        <span>代码开源:</span>
        <Link
          className=" text-blue-500 hover:underline"
          href="https://github.com/vectorisvector/inscription"
          target="_blank"
        >
          Alpha Script
        </Link>

        <span>dev:</span>
        <Link
          className=" text-blue-500 hover:underline"
          href="https://twitter.com/cybervector_"
          target="_blank"
        >
          @cybervector_
        </Link>

        <span>alpha:</span>
        <Link
          className=" text-blue-500 hover:underline"
          href="https://twitter.com/ChaunceyCrypto"
          target="_blank"
        >
          @ChaunceyCrypto
        </Link>
      </div>

      <div className=" flex flex-col gap-2">
        <span>私钥（必填，每行一个）:</span>
        <input
          className=" w-[800px] rounded-lg border p-2"
          placeholder="私钥，不要带 0x，程序会自动处理"
          onChange={(e) => {
            const text = e.target.value;
            const lines = text.split("\n");
            const accounts = lines.map((line) => {
              const key = "0x" + line.trim();
              if (/^0x[a-fA-F0-9]{64}$/.test(key)) {
                return privateKeyToAccount(key as Hex);
              }
            });
            setAccounts(accounts.filter((x) => x) as PrivateKeyAccount[]);
          }}
        />
      </div>

      <div className=" flex flex-col gap-2">
        <span>fromId（必填，你自己的 NFT TokenId）:</span>
        <input
          className=" h-10 w-[800px] rounded-lg border px-2"
          placeholder="fromId "
          type="number"
          onChange={(e) => {
            const text = e.target.value;
            setFromId(Number(text));
          }}
        />
      </div>

      <div className=" flex flex-col gap-2">
        <span>toId（必填，对手的 NFT TokenId）:</span>
        <input
          className=" h-10 w-[800px] rounded-lg border px-2"
          placeholder="fromId "
          type="number"
          onChange={(e) => {
            const text = e.target.value;
            setToId(Number(text));
          }}
        />
      </div>

      <div className=" flex items-center justify-center gap-5">
        <button
          className={classNames(
            " h-10 w-[200px] rounded-full bg-green-600 text-white transition-all hover:opacity-80",
          )}
          onClick={run}
        >
          运行
        </button>

        <input
          className=" h-10 w-[240px] rounded-lg border px-2"
          placeholder="矿工小费（默认 0）"
          type="number"
          onChange={(e) => {
            const text = e.target.value;
            setFee(Number(text));
          }}
        />
      </div>

      <div className=" mt-5 flex w-[1000px] flex-col gap-2">
        <span>{`日志（计数 = ${
          logs.filter((log) => log.includes("✅")).length
        }）:`}</span>
        <div className=" flex h-[600px] flex-col gap-1 overflow-auto rounded-lg bg-gray-100 px-4 py-2">
          {logs.map((log, index) => (
            <div
              key={log + index}
              className=" flex h-8 items-center"
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
