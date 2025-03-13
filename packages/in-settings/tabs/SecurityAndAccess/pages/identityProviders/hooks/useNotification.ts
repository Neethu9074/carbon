/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useState, useEffect } from 'react';

import { CarbonInlineNotificationProps } from '@instana/components';

const useNotification = (
  errorMessage?: string
): [
  CarbonInlineNotificationProps | undefined,
  React.Dispatch<React.SetStateAction<CarbonInlineNotificationProps | undefined>>
] => {
  const [notification, setNotification] = useState<CarbonInlineNotificationProps | undefined>();

  useEffect(() => {
    if (!errorMessage) return;
    setNotification({ kind: 'error', subtitle: errorMessage });
  }, [errorMessage]);

  return [notification, setNotification];
};

export default useNotification;
