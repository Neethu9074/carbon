/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { useMemo } from 'react';

import { generateStableHash } from 'in-services/util/id';

export default function useStableObjectIntance(obj) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => obj, [generateStableHash(obj)]);
}
