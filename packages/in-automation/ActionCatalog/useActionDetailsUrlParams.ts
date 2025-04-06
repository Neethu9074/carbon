/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo } from 'react';

export default function useActionDetailsUrlParams1({ actionId, copy = false }: { actionId?: string; copy: boolean }) {
  return useMemo(() => {
    const isCopy = copy;
    const isCreate = !actionId;
    const isNew = isCreate || isCopy;

    return {
      id: actionId ?? null,
      isNew,
      isCreate,
      isCopy
    };
  }, [actionId, copy]);
}
