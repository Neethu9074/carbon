/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useMemo } from 'react';

import { policyDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import useUrlState from 'in-hooks/useUrlState';

export default function usePolicyDetailsUrlParams({ policyId, copy }: { policyId?: string; copy?: boolean } = {}) {
  const [{ id, op }] = useUrlState<{ id?: string; op: 'copy' | null }>({
    bind: [policyDetailsUrlParameters.id, policyDetailsUrlParameters.op]
  });

  const finalPolicyId = policyId ?? id;
  const finalCopy = copy ?? op === 'copy';
  return useMemo(() => {
    const isCopy = finalCopy;
    const isCreate = !finalPolicyId;
    const isNew = isCreate || isCopy;
    return {
      id: finalPolicyId ?? null,
      isNew,
      isCopy
    };
  }, [finalPolicyId, finalCopy]);
}
