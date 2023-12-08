/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useState } from 'react';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { OrderDirection } from 'in-types';

export function usePagination(orderByString?: string, orderDirectionString?: OrderDirection) {
  const [tableState, setTableState] = useState<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>({
    page: 1,
    pageSize: 7,
    orderBy: orderByString ?? 'name',
    orderDirection: orderDirectionString ?? 'ASC',
    query: ''
  });

  const updateTableState = (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => {
    setTableState(state => ({
      ...state,
      ...newState
    }));
  };

  return [tableState, updateTableState] as const;
}
