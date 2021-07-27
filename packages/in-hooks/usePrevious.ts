/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useRef, useEffect } from 'react';

export default function usePrevious(value: any): any {
  const ref: React.MutableRefObject<any> = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
