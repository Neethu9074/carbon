/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useEffect, useRef } from 'react';

/**
 * Warning: Changing callbackOnUnmount are not supported! This hook will always use the
 * first version passed in.
 */
export default function useTimeSpentInsideComponent(callbackOnUnmount: (duration: number) => void) {
  const timeHidden = useRef<number>(0);
  const durationHidden = useRef<number>(0);
  const timeStarted = useRef<number>(Date.now());

  useEffect(
    () => {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          timeHidden.current = Date.now();
        } else if (document.visibilityState === 'visible') {
          durationHidden.current = durationHidden.current + (Date.now() - timeHidden.current);
        }
      });

      return () => {
        const now = Date.now();
        callbackOnUnmount(now - timeStarted.current - durationHidden.current);
      };
    },
    // This hook does not support changing parameters. It is a limitation of this implementation
    // approach.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}
