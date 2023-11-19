"use client";

import classNames from "classnames";
import { useCallback, useState } from "react";
import {
  Hex,
  PrivateKeyAccount,
  createWalletClient,
  http,
  isAddress,
  stringToHex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { avalanche } from "viem/chains";

const defaultAvalancheRpc =
  "https://avalanche-mainnet.infura.io/v3/89a0656361da45419291de4bce4ccc62";

export default function Home() {
  const [accounts, setAccounts] = useState<PrivateKeyAccount[]>([]);
  const [toAddress, setToAddress] = useState<Hex>();
  const [inscription, setInscription] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [rpc, setRpc] = useState<string>();
  const [intervalTime, setIntervalTime] = useState<number>(1000);

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

  const run = useCallback(() => {
    if (accounts.length === 0) {
      setLogs((logs) => [...logs, handleLog("没有私钥", "error")]);
      setRunning(false);
      return;
    }

    if (!toAddress) {
      setLogs((logs) => [...logs, handleLog("没有地址", "error")]);
      setRunning(false);
      return;
    }

    if (!inscription) {
      setLogs((logs) => [...logs, handleLog("没有铭文", "error")]);
      setRunning(false);
      return;
    }

    const client = createWalletClient({
      chain: avalanche,
      transport: http(rpc || defaultAvalancheRpc),
    });

    const timer = setInterval(async () => {
      for (const account of accounts) {
        try {
          const hash = await client.sendTransaction({
            account,
            to: toAddress,
            value: 0n,
            data: stringToHex(inscription),
          });
          setLogs((logs) => [
            ...logs,
            handleLog(`${handleAddress(account.address)} ${hash}`, "success"),
          ]);
        } catch (error) {
          setLogs((logs) => [
            ...logs,
            handleLog(`${handleAddress(account.address)} error`, "error"),
          ]);
        }
      }
    }, intervalTime);
    setTimer(timer);
  }, [accounts, inscription, intervalTime, rpc, toAddress]);

  return (
    <main className=" flex flex-col items-center gap-5">
      <h1 className=" mt-5 text-5xl">Inscription</h1>

      <div className=" mt-3 flex flex-col gap-2">
        <span>私钥（每行一个）:</span>
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

      <div className=" mt-3 flex flex-col gap-2">
        <span>转给谁的地址:</span>
        <input
          className=" h-10 w-[800px] rounded-lg border px-2"
          placeholder="地址"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            isAddress(text) && setToAddress(text);
          }}
        />
      </div>

      <div className=" mt-3 flex flex-col gap-2">
        <span>自己的 rpc（可选，最好用自己的）:</span>
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

      <div className=" mt-3 flex flex-col gap-2">
        <span>要打的铭文:</span>
        <textarea
          className=" h-[100px] w-[800px] rounded-lg border p-2"
          placeholder="铭文"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setInscription(text);
          }}
        />
      </div>

      <div className=" mt-3 flex items-center justify-center gap-5">
        <button
          className={classNames(
            " h-10 w-[200px] rounded-full text-white transition-all hover:opacity-80",
            running ? " bg-red-600" : " bg-green-600",
          )}
          onClick={() => {
            if (!running) {
              setRunning(true);
              run();
            } else {
              setRunning(false);
              timer && clearInterval(timer);
            }
          }}
        >
          {running ? "运行中" : "运行"}
        </button>

        <input
          className=" h-10 w-[400px] rounded-lg border px-2"
          placeholder="间隔时间（默认 1000ms）"
          type="number"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setIntervalTime(Number(text));
          }}
        />
      </div>

      <div className=" mt-5 flex w-[1000px] flex-col gap-2">
        <span>日志:</span>
        <div className=" mt-3 flex h-[600px] flex-col gap-1 overflow-auto rounded-lg bg-gray-100 px-4 py-2">
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
