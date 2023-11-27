"use client";

import {
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { createWalletClient, Hex, http } from "viem";
import { mainnet } from "viem/chains";

import Log from "@/components/Log";
import useIsClient from "@/hooks/useIsClient";
import { handleLog } from "@/utils/helper";

type RadioType = "prod" | "test";

export default function Ierc() {
  const workers = useRef<Worker[]>();
  const [radio, setRadio] = useState<RadioType>("prod");
  const [privateKey, setPrivateKey] = useState<Hex>();
  const [rpc, setRpc] = useState<string>();
  const [tick, setTick] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [gas, setGas] = useState<number>(0);
  const [cpu, setCpu] = useState<number>(1);
  const [running, setRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const isClient = useIsClient();
  const coreCount = useMemo(
    () => (isClient ? navigator.hardwareConcurrency : 1),
    [isClient],
  );

  const pushLog = useCallback((log: string, state?: string) => {
    setLogs((logs) => [handleLog(log, state), ...logs]);
  }, []);

  const generateWorkers = useCallback(() => {
    const newWorkers = [];
    for (let i = 0; i < cpu; i++) {
      const workerUrl = new URL("./runIercMine.js", import.meta.url);

      const worker = new Worker(workerUrl);
      newWorkers.push(worker);

      worker.onerror = (e) => {
        pushLog(`Worker ${i} error: ${e.message}`, "error");
      };
      worker.onmessage = (e) => {
        const { data } = e;
        if (data.type === "log") {
          pushLog(data.log);
        }
        if (data.type === "result") {
          pushLog(data.log, "success");
        }
      };
    }
    workers.current = newWorkers;
  }, [cpu, pushLog]);

  const run = useCallback(() => {
    if (!privateKey) {
      pushLog("没有私钥", "error");
      setRunning(false);
      return;
    }

    if (!tick) {
      setLogs((logs) => [handleLog("没有 tick", "error"), ...logs]);
      pushLog("没有 tick", "error");
      setRunning(false);
      return;
    }

    if (!difficulty) {
      pushLog("没有难度", "error");
      setRunning(false);
      return;
    }

    generateWorkers();
  }, [difficulty, generateWorkers, privateKey, pushLog, tick]);

  const end = useCallback(() => {}, []);

  return (
    <div className=" flex flex-col gap-4">
      <RadioGroup
        row
        defaultValue="prod"
        onChange={(e) => {
          const value = e.target.value as RadioType;
          setRadio(value);
        }}
      >
        <FormControlLabel
          value="prod"
          control={<Radio />}
          label="正式环境"
          disabled={running}
        />
        <FormControlLabel
          value="test"
          control={<Radio />}
          label="测试环境"
          disabled={running}
        />
      </RadioGroup>

      <div className=" flex flex-col gap-2">
        <span>私钥（必填）:</span>
        <TextField
          size="small"
          placeholder="私钥，带不带 0x 都行，程序会自动处理"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            const key = text.trim();
            if (/^[a-fA-F0-9]{64}$/.test(key)) {
              setPrivateKey(`0x${key}`);
            }
            if (/^0x[a-fA-F0-9]{64}$/.test(key)) {
              setPrivateKey(key as Hex);
            }
          }}
        />
      </div>

      <div className=" flex flex-col gap-2">
        <span>Tick（必填，例子：ierc-m5）:</span>
        <TextField
          size="small"
          placeholder="tick，例子：ierc-m5"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setTick(text.trim());
          }}
        />
      </div>

      <div className=" flex flex-col gap-2">
        <span>难度（必填，十六进制，例子：0x00000）:</span>
        <TextField
          size="small"
          placeholder="难度，十六进制，例子：0x00000"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setDifficulty(text.trim());
          }}
        />
      </div>

      <div className=" flex flex-col gap-2">
        <span>cpu 核心数:</span>
        <TextField
          select
          defaultValue={1}
          size="small"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setCpu(Number(text));
          }}
        >
          {new Array(coreCount).fill(null).map((_, index) => (
            <MenuItem
              key={index}
              value={index + 1}
            >
              {index + 1}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className=" flex flex-col gap-2">
        <span>RPC（选填，默认公共，http，最好用自己的）:</span>
        <TextField
          size="small"
          placeholder="RPC"
          disabled={running}
          onChange={(e) => {
            const text = e.target.value;
            setRpc(text);
          }}
        />
      </div>

      <div className=" flex flex-col gap-2">
        <span>额外 gas 费（选填，额外给矿工的小费）:</span>
        <TextField
          type="number"
          size="small"
          placeholder="默认 0，单位 gwei，例子: 10"
          disabled={running}
          onChange={(e) => {
            const num = Number(e.target.value);
            !Number.isNaN(num) && num >= 0 && setGas(num);
          }}
        />
      </div>

      <Button
        variant="contained"
        className=" max-w-md"
        color={running ? "error" : "success"}
        onClick={() => {
          if (!running) {
            setRunning(true);
            run();
          } else {
            setRunning(false);
            end();
          }
        }}
      >
        {running ? "运行中" : "运行"}
      </Button>

      <Log
        title={`日志（成功次数 = ${
          logs.filter((log) => log.includes("✅")).length
        }）:`}
        logs={logs}
      />
    </div>
  );
}
