/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useMemo } from 'react';

import { actionDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import useUrlState from 'in-hooks/useUrlState';

export default function useActionDetailsUrlParams() {
  const [{ id, op }] = useUrlState<{ id?: string; op: 'copy' | null }>({
    bind: [actionDetailsUrlParameters.id, actionDetailsUrlParameters.op]
  });

  return useMemo(() => {
    const isCopy = op === 'copy';
    const isCreate = !id;
    const isNew = isCreate || isCopy;
    return {
      id: id ?? null,
      isNew,
      isCreate,
      isCopy
    };
  }, [id, op]);
}
