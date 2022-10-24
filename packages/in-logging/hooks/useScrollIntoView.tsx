/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useEffect, useRef } from 'react';

const useScrollIntoView = (
  deps: unknown[] = [],
  condition: boolean,
  callback?: () => void,
  scrollPosition: ScrollLogicalPosition = 'center'
) => {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    if (condition) {
      ref.current?.scrollIntoView({ block: scrollPosition });
      callback?.();
    }
  }, [...deps, condition]);

  return ref;
};

export default useScrollIntoView;
