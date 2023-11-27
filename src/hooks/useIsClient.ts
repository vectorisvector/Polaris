import { useEffect, useState } from "react";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== undefined);
  }, []);

  return isClient;
}

export default useIsClient;
