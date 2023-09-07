/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { formatDateTime } from '@instana/format-date';

import LogMessageColumn from 'in-synthetics/dashboards/details/components/LogMessageColumn';
import { BrowserMessage } from 'in-synthetics/utils/constants';
import Pill from 'in-components/Pill/Pill';
import theme from 'in-themes';

import locals from 'in-synthetics/dashboards/details/components/Logs.mless';

interface LogLevelColumnProps {
  item: BrowserMessage;
  name: string;
  timestamp: number;
}

const logPillColorMap = new Map<string, string>([
  ['severe', theme.lib.colors.red800],
  ['warning', theme.lib.colors.yellow800],
  ['info', theme.lib.colors.lightBlue800]
]);

export const logLevelColumn = {
  id: 'logLevel',
  width: 'fit-content',
  widthInAbsoluteUnit: true,
  getContent({ item }: LogLevelColumnProps) {
    return (
      <div className={locals.healthColumn}>
        <Pill className={locals.pill} color={logPillColorMap.get(item.level.toLowerCase())}>
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
    return <div className={locals.dateTime}>{formatDateTime(item.timestamp)}</div>;
  }
};

export const logMessageColum = {
  id: 'logMessage',
  useMaxHeight: true,
  widthInAbsoluteUnit: true,
  getContent: ({ item }: LogLevelColumnProps) => {
    return <LogMessageColumn logs={item.message} />;
  }
};
