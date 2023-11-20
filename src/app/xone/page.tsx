"use client";

import xoneAbi from "@/abis/xone";
import classNames from "classnames";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  Hex,
  PrivateKeyAccount,
  createPublicClient,
  createWalletClient,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

export default function Home() {
  const [accounts, setAccounts] = useState<PrivateKeyAccount[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState<boolean>(false);
  const [rpc, setRpc] = useState<string>();
  const [fee, setFee] = useState<number>(0);
  const [tokenId, setTokenId] = useState<number>();

  const handleLog = (log: string, state: string = "success") => {
    return `${new Date().toLocaleString()} ${
      state === "success" ? "✅" : state === "error" ? "❌" : ""
    } => ${log}`;
  };

  const handleAddress = (address: Hex) => {
    const prefix = address.slice(0, 6);
    const suffix = address.slice(-4);
    return `${prefix}...${suffix}`;
  };

  const run = useCallback(async () => {
    if (accounts.length === 0) {
      setLogs((logs) => [...logs, handleLog("没有私钥", "error")]);
      setRunning(false);
      return;
    }

    const client = createPublicClient({
      chain: mainnet,
      transport: http(rpc),
    });

    const walletClient = createWalletClient({
      chain: mainnet,
      transport: http(rpc),
    });

    for (const account of accounts) {
      try {
        const { request } = await client.simulateContract({
          account,
          address: "0x4DCDa2274899d9BbA3Bb6f5A852C107Dd6E4fE1c",
          abi: xoneAbi,
          functionName: "mint",
          maxPriorityFeePerGas: BigInt(fee),
          args: [BigInt(tokenId || 0), false],
        });
        const hash = await walletClient.writeContract(request);
        setLogs((logs) => [
          ...logs,
          handleLog(`${handleAddress(account.address)} ${hash}`, "success"),
        ]);
        setRunning(false);
      } catch (error) {
        setLogs((logs) => [
          ...logs,
          handleLog(`${handleAddress(account.address)} error`, "error"),
        ]);
      }
    }
  }, [accounts, fee, rpc, tokenId]);

  return (
    <main className=" flex flex-col items-center gap-5 py-5">
      <h1 className=" text-5xl">XONE</h1>

      <div className=" flex items-center gap-2">
        <span>代码开源:</span>
        <Link
          className=" text-blue-500 hover:underline"
          href="https://github.com/vectorisvector/inscription"
          target="_blank"
        >
          https://github.com/vectorisvector/inscription
        </Link>

        <span>alpha推特:</span>
        <Link
          className=" text-blue-500 hover:underline"
          href="https://twitter.com/ChaunceyCrypto"
          target="_blank"
        >
          https://twitter.com/ChaunceyCrypto
        </Link>
      </div>

      <div className=" flex flex-col gap-2">
        <span>私钥（必填，每行一个）:</span>
        <textarea
          className=" h-[100px] w-[800px] rounded-lg border p-2"
          placeholder="私钥"
          disabled={running}
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
        <span>rpc（可选，默认公共，http，最好用自己的）:</span>
        <input
          className=" h-10 w-[800px] rounded-lg border px-2"
          placeholder="rpc"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setRpc(text);
          }}
        />
      </div>

      <div className=" flex flex-col gap-2">
        <span>tokenId（选填，如果你有 XENFT 就填，没有就别管）:</span>
        <input
          className=" h-10 w-[800px] rounded-lg border px-2"
          placeholder="tokenId "
          type="number"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setTokenId(Number(text));
          }}
        />
      </div>

      <div className=" flex items-center justify-center gap-5">
        <button
          className={classNames(
            " h-10 w-[200px] rounded-full text-white transition-all hover:opacity-80",
            running ? " bg-red-600" : " bg-green-600",
          )}
          onClick={() => {
            if (!running) {
              setRunning(true);
              run();
            }
          }}
        >
          {running ? "运行中" : "运行"}
        </button>

        <input
          className=" h-10 w-[240px] rounded-lg border px-2"
          placeholder="矿工小费（默认 0）"
          type="number"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setFee(Number(text));
          }}
        />
      </div>

      <div className=" mt-5 flex w-[1000px] flex-col gap-2">
        <span>日志:</span>
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
