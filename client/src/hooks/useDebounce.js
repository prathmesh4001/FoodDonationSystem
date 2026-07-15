import { useState, useEffect, useRef } from 'react';

/**
 * Debounce a value by a given delay (ms).
 * @param {any} value - The value to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {any} The debounced value.
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Manage async data fetching with loading, error, and data states.
 * @param {Function} fetchFn - Async function to call.
 * @param {boolean} immediate - Whether to run immediately on mount.
 */
export const useAsync = (fetchFn, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      if (mountedRef.current) setData(result);
      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
      }
      throw err;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) execute();
    return () => {
      mountedRef.current = false;
    };
  }, []); // eslint-disable-line

  return { data, loading, error, execute, setData };
};
