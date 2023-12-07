import { useEffect, useRef } from "react";

import { sleep } from "@/utils/helper";

export default function useInterval(
  callback: () => Promise<void>,
  delay: number | null,
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 设置和清除循环
  useEffect(() => {
    let isRunning = true;

    async function tick() {
      while (isRunning && delay !== null) {
        await savedCallback.current();
        await sleep(delay);
      }
    }

    tick();

    return () => {
      isRunning = false;
    };
  }, [delay]);
}
