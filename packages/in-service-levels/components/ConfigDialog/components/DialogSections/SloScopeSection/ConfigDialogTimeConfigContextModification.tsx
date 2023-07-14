/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import LocalTimeConfigContextModification from 'in-stores/time/LocalTimeConfigContextModification';
import { days } from 'in-services/time/time';

export default function ConfigDialogTimeConfigContextModification({ children }: any) {
  const timeWindowSizeForSevenDays = days.toMillis(7);

  return (
    <LocalTimeConfigContextModification
      modification={() => modifyTimeConfig(timeWindowSizeForSevenDays)}
      valuesToWatch={[timeWindowSizeForSevenDays]}
    >
      {children}
    </LocalTimeConfigContextModification>
  );
}

function modifyTimeConfig(windowSize: number) {
  return {
    windowSize: windowSize,
    autoRefresh: false
  };
}
