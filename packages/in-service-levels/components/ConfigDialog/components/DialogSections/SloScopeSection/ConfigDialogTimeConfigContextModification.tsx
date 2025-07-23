/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import type { PropsWithChildren } from 'react';
import React from 'react';

import type { TimeConfig } from '@instana/types';

import LocalTimeConfigContextModification from 'in-stores/time/LocalTimeConfigContextModification';
import { days } from 'in-services/time/time';

export default function ConfigDialogTimeConfigContextModification({ children }: PropsWithChildren<{}>) {
  return (
    <LocalTimeConfigContextModification modification={modifyTimeConfig}>{children}</LocalTimeConfigContextModification>
  );
}

function modifyTimeConfig(timeConfig: TimeConfig) {
  return {
    ...timeConfig,
    windowSize: days.toMillis(7),
    autoRefresh: false
  };
}
