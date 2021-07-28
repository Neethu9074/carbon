/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useRef, useEffect } from 'react';

export default function usePrevious<T>(value: T): T | undefined {
  const ref: React.MutableRefObject<T | undefined> = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
