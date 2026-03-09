import { useEffect, useState } from "react";

function useIsMounted() {
  const [isMounted, setIsMounted] = useState<boolean>(true);

  useEffect(() => {
    setIsMounted(false);
  }, []);

  return isMounted;
}

export default useIsMounted;
