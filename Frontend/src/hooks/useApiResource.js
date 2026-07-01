import { useCallback, useEffect, useState } from "react";

/**
 * Issue #21: Fixed stale closure — accepts a dependency array
 * so the loader can be re-invoked when deps change.
 * The loader is also wrapped in useCallback for stability.
 */
export const useApiResource = (loader, initialValue = [], deps = []) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableLoader = useCallback(loader, deps);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await stableLoader();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "Unable to load data");
      return initialValue;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableLoader]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, setData, loading, error, refresh };
};
