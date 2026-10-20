import { useEffect, useState } from "react";

/**
 * useFetch - a custom hook that fetches data from a URL.
 *
 * @param {string} url - The endpoint to fetch JSON data from.
 * @param {RequestInit} [options] - Optional extra fetch options (method, headers, ...).
 * @returns {{ data: any, loading: boolean, error: string | null }}
 *   data    -> parsed response body (null until the first successful response)
 *   loading -> true while a request is in flight
 *   error   -> error message string, or null when there is no error
 */
const useFetch = (url, options) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Depend on url/options as values: serialise them so a new object literal
  // passed on every render does not trigger an infinite refetch loop.
  const optionsKey = JSON.stringify(options ?? {});

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError("No URL provided to useFetch.");
      return;
    }

    // AbortController lets us cancel an in-flight request when the URL
    // changes (or the component unmounts) so stale responses never
    // overwrite fresh state.
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch(url, { ...JSON.parse(optionsKey), signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch((err) => {
        // Ignore the abort itself - it is expected during cleanup.
        if (err.name === "AbortError") return;
        setData(null);
        setError(err.message || "Something went wrong while fetching data.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [url, optionsKey]);

  return { data, loading, error };
};

export default useFetch;
