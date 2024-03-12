/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect, useMemo, useRef } from 'react';
import { debounce } from 'lodash';

/**
 * React hook that delays the exution of the provided function.
 *
 * @param func Function to be invoked after specified delay.
 * @param delay Time in ms until the function is invoked.
 *
 * @returns Debounced version of the function that has been provided.
 */
const useDebounce = (func: () => void, delay: number) => {
  const refFunc = useRef(func);

  useEffect(() => {
    // Ensure debounce function can access current state
    refFunc.current = func;
  }, [func]);

  // Memoize function to make sure debounce timer is not recreated each time
  const memoizedFunc = useMemo(() => {
    const debounceFunc = () => {
      // Call passed function
      refFunc.current?.();
    };

    return debounce(debounceFunc, delay);
  }, [delay]);

  return memoizedFunc;
};

export default useDebounce;
