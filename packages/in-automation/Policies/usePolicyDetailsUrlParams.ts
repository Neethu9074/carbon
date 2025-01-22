/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useMemo } from 'react';

import { policyDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import useUrlState from 'in-hooks/useUrlState';

export default function usePolicyDetailsUrlParams() {
  const [{ id, op }] = useUrlState<{ id?: string; op: 'copy' | null }>({
    bind: [policyDetailsUrlParameters.id, policyDetailsUrlParameters.op]
  });

  return useMemo(() => {
    const isCopy = op === 'copy';
    const isCreate = !id;
    const isNew = isCreate || isCopy;
    return {
      id: id ?? null,
      isNew,
      isCopy
    };
  }, [id, op]);
}
