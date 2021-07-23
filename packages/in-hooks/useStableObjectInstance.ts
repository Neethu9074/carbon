/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useMemo } from 'react';

import { generateStableHash } from '@instana/utils';

export default function useStableObjectInstance<T>(obj: T): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => obj, [generateStableHash(obj)]);
}
