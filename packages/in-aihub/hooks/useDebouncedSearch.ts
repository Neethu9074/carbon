/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';

// debounce search query for the @tanstack/carbon table
export default function useDebouncedSearch(onSearch: (query: string) => void, delay: number = 500) {
  const debouncedCallback = useMemo(() => {
    return debounce(onSearch, delay);
  }, [onSearch, delay]);

  return useCallback(
    (query: string) => {
      debouncedCallback(query);
    },
    [debouncedCallback]
  );
}
