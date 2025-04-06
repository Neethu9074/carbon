/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { generateStableHash } from '@instana/utils';

export default function useDerivedState<T extends Object>(props: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(props);

  useEffect(() => {
    setState(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(props)]);

  return [state, setState];
}
