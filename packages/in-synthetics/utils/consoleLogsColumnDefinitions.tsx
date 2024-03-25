/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Pill } from '@instana/components';

import locals from 'in-synthetics/dashboards/details/components/Logs.mless';

interface LogLevelColumnProps {
  name: string;
}

export const consoleLogLevelColumn = {
  id: 'consoleLogLevel',
  width: 'fit-content',
  widthInAbsoluteUnit: true,
  getContent({ name }: LogLevelColumnProps) {
    return (
      <div className={locals.healthColumn}>
        <Pill className={locals.pill} type={'high-contrast'}>
          {name}
        </Pill>
      </div>
    );
  }
};
