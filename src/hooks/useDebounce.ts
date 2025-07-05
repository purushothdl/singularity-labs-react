import { useState, useEffect } from 'react';

/**
 * A custom React hook that debounces a value.
 * @param value The value to debounce (e.g., a search query).
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value, which only updates after the delay.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay has passed
    // This is the core of debouncing: we cancel the previous timer and start a new one.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run the effect only if the value or delay changes

  return debouncedValue;
}