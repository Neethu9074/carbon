/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { debounce } from 'lodash';
import { useMemo } from 'react';

import { OrderDirection } from '@instana/types';

import { TableState } from 'in-synthetics/components/constants';

/**
 * Hook to create a debounced search handler
 */
export function useSearchHandler(
  onChange: (state: Partial<TableState>) => void,
  orderBy: string,
  orderDirection: OrderDirection,
  pageSize: number,
  pageSizes?: number[]
) {
  return useMemo(
    () =>
      debounce((searchInput: string) => {
        if (searchInput !== undefined) {
          onChange({ query: searchInput, orderBy, orderDirection, page: 1, pageSize, pageSizes });
        }
      }, 500),
    [onChange, orderBy, orderDirection, pageSize, pageSizes]
  );
}
