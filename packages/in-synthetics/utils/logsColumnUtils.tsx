/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { formatDateTime } from '@instana/format-date';

import Pill from 'in-components/Pill/Pill';

import locals from 'in-synthetics/dashboards/details/components/Logs.mless';

interface LogLevelColumnProps {
  name: string;
}

export const logLevelColumn = {
  id: 'consoleLog',
  width: '4.5rem',
  widthInAbsoluteUnit: true,
  getContent({ name }: LogLevelColumnProps) {
    return (
      <div className={locals.healthColumn}>
        <Pill className={locals.pill}>{name}</Pill>
      </div>
    );
  }
};

interface TimestampColumnProps {
  timestamp: number;
}

export const timestampColumn = {
  id: 'timestamp',
  width: '11rem',
  useMaxHeight: true,
  widthInAbsoluteUnit: true,
  getContent({ timestamp }: TimestampColumnProps) {
    return <div className={locals.dateTime}>{formatDateTime(timestamp)}</div>;
  }
};
