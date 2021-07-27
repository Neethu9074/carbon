/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useState, useEffect } from 'react';

export default function useTimeSpentInsideComponent(callbackOnUnmount) {
  const [timeStarted] = useState(Date.now());
  useEffect(() => {
    return () => {
      const now = Date.now();
      callbackOnUnmount(now - timeStarted);
    };
  }, []);
}
