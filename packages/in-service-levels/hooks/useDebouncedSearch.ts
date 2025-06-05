/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { debounce } from 'lodash';
import { useMemo } from 'react';

// debounce search query for the @tanstack/carbon table
export default function useDebouncedSearch(onSearch: (query: string) => void, delay: number = 500) {
  const debouncedCallback = useMemo(() => {
    return debounce((value?: string) => {
      if (value !== undefined) {
        onSearch(value);
      }
    }, delay);
  }, [onSearch, delay]);

  return debouncedCallback;
}
