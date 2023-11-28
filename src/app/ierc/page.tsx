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
import { Hex } from "viem";

import Log from "@/components/Log";
import useIsClient from "@/hooks/useIsClient";
import { handleLog } from "@/utils/helper";

type RadioType = "prod" | "test";

interface IWorkerData {
  log?: string;
  mineRate?: number;
}

export default function Ierc() {
  const workers = useRef<Worker[]>([]);
  const [radio, setRadio] = useState<RadioType>("prod");
  const [privateKey, setPrivateKey] = useState<Hex>();
  const [rpc, setRpc] = useState<string>();
  const [tick, setTick] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("");
  const [gasPremium, setGasPremium] = useState<number>(110);
  const [cpu, setCpu] = useState<number>(1);
  const [running, setRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [mineRateList, setMineRateList] = useState<number[]>([]);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [customCpu, setCustomCpu] = useState<number>(0);

  const isClient = useIsClient();
  const coreCount = useMemo(
    () => (isClient ? navigator.hardwareConcurrency : 1),
    [isClient],
  );

  const mineRate = useMemo(() => {
    return mineRateList.reduce((a, b) => a + b, 0);
  }, [mineRateList]);

  const pushLog = useCallback((log: string, state?: string) => {
    setLogs((logs) => [handleLog(log, state), ...logs]);
  }, []);

  const generateWorkers = useCallback(() => {
    const newWorkers = [];
    const cpuCount = customCpu > 0 ? customCpu : cpu;
    for (let i = 0; i < cpuCount; i++) {
      const worker = new Worker(new URL("./mine.js", import.meta.url));
      newWorkers.push(worker);

      worker.postMessage({
        index: i,
        privateKey,
        rpc,
        tick,
        amount,
        difficulty,
        gasPremium,
        env: radio,
      });

      worker.onerror = (e) => {
        pushLog(`Worker ${i} error: ${e.message}`, "error");
      };
      worker.onmessage = (e) => {
        const data = e.data as IWorkerData;
        if (data.log) {
          pushLog(data.log);
          setSuccessCount((count) => count + 1);
        }
        if (data.mineRate) {
          const rate = data.mineRate;
          setMineRateList((list) => {
            const newList = [...list];
            newList[i] = rate;
            return newList;
          });
        }
      };
    }
    workers.current = newWorkers;
  }, [
    amount,
    cpu,
    customCpu,
    difficulty,
    gasPremium,
    privateKey,
    pushLog,
    radio,
    rpc,
    tick,
  ]);

  const run = useCallback(() => {
    if (!privateKey) {
      pushLog("没有私钥", "error");
      setRunning(false);
      return;
    }

    if (!tick) {
      pushLog("没有 tick", "error");
      setRunning(false);
      return;
    }

    if (!amount) {
      pushLog("没有数量", "error");
      setRunning(false);
      return;
    }

    if (!difficulty) {
      pushLog("没有难度", "error");
      setRunning(false);
      return;
    }

    pushLog("🚀🚀🚀 Start Mining...");

    generateWorkers();
  }, [amount, difficulty, generateWorkers, privateKey, pushLog, tick]);

  const end = useCallback(() => {
    workers.current?.forEach((worker) => {
      worker.terminate();
    });
    workers.current = [];
  }, []);

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
        <span>数量（必填，每张数量）:</span>
        <TextField
          type="number"
          size="small"
          placeholder="数量，例子：10000"
          disabled={running}
          onChange={(e) => {
            const num = Number(e.target.value);
            !Number.isNaN(num) && num >= 0 && setAmount(num);
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
        <div className=" flex items-center gap-2">
          <span>cpu 核心数:</span>
          <Button
            size="small"
            color="secondary"
            disabled={running}
            onClick={() => {
              setCustomCpu((_customCpu) => (_customCpu <= 0 ? 1 : -1));
              setMineRateList([]);
            }}
          >
            自定义
          </Button>
        </div>
        {customCpu <= 0 ? (
          <TextField
            select
            defaultValue={1}
            size="small"
            disabled={running}
            onChange={(e) => {
              const text = e.target.value;
              setCpu(Number(text));
              setMineRateList([]);
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
        ) : (
          <TextField
            type="number"
            size="small"
            placeholder="cpu 核心数，例子：12"
            disabled={running}
            value={customCpu}
            onChange={(e) => {
              const num = Number(e.target.value);
              !Number.isNaN(num) && setCustomCpu(Math.floor(num));
            }}
          />
        )}
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
        <span>
          gas 溢价（选填，启动程序时候的 gasPrice 乘以溢价作为付出的最高 gas）:
        </span>
        <TextField
          type="number"
          size="small"
          placeholder="默认 110 也就是 1.1 倍率，最低限制 100，例子: 110"
          disabled={running}
          onChange={(e) => {
            const num = Number(e.target.value);
            !Number.isNaN(num) && num >= 100 && setGasPremium(num);
          }}
        />
      </div>

      <Button
        variant="contained"
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
        title={`日志（效率 => ${mineRate} c/s 成功次数 => ${successCount}）:`}
        logs={logs}
        onClear={() => {
          setLogs([]);
        }}
      />
    </div>
  );
}
