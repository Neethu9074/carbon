/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useState, useEffect } from 'react';

/**
 * Warning: Changing callbackOnUnmount are not supported! This hook will always use the
 * first version passed in.
 */
export default function useTimeSpentInsideComponent(callbackOnUnmount: (duration: number) => void) {
  const [timeStarted] = useState(Date.now());
  useEffect(
    () => () => {
      const now = Date.now();
      callbackOnUnmount(now - timeStarted);
    },
    // This hook does not support changing parameters. It is a limitation of this implementation
    // approach.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}
