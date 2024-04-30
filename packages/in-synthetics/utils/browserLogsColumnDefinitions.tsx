/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { formatDateTime } from '@instana/format-date';
import { Pill } from '@instana/components';

import LogMessageColumn from 'in-synthetics/dashboards/details/components/LogMessageColumn';
import { BrowserMessage } from 'in-synthetics/utils/constants';

import locals from 'in-synthetics/dashboards/details/components/Logs.mless';

interface LogLevelColumnProps {
  item: BrowserMessage;
  name: string;
  timestamp: number;
}

type PillType =
  | 'red'
  | 'blue'
  | 'magenta'
  | 'purple'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'gray'
  | 'cool-gray'
  | 'warm-gray'
  | 'high-contrast'
  | 'outline'
  | undefined;

export const logLevelColumn = {
  id: 'logLevel',
  width: 'fit-content',
  widthInAbsoluteUnit: true,
  getContent: function Content({ item }: LogLevelColumnProps) {
    const logPillColorMap = new Map<string, string>([
      ['severe', 'red'],
      ['warning', 'high-contrast'],
      ['info', 'blue']
    ]);
    return (
      <div className={locals.healthColumn}>
        <Pill className={locals.pill} type={logPillColorMap.get(item.level.toLowerCase()) as PillType}>
          {item.level}
        </Pill>
      </div>
    );
  }
};

export const timestampColumn = {
  id: 'timestamp',
  width: '11rem',
  useMaxHeight: true,
  widthInAbsoluteUnit: true,
  getContent({ item }: LogLevelColumnProps) {
    return <div className={locals.dateTime}>{formatDateTime(item?.timestamp)}</div>;
  }
};

export const logMessageColum = {
  id: 'logMessage',
  useMaxHeight: true,
  widthInAbsoluteUnit: true,
  getContent: ({ item }: LogLevelColumnProps) => {
    return <LogMessageColumn logs={item?.message} />;
  }
};
