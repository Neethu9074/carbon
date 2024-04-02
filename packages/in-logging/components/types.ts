/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Dispatch, SetStateAction } from 'react';

import { TraceActivityTreeNode, LogItem } from '@instana/types/typeDefinitions';
import { Progress, TimeConfig } from '@instana/types';

export type LogLevel = 'WARN' | 'ERROR' | 'INFO' | 'DEBUG' | 'TRACE' | 'UNKNOWN';
export type LowercaseLogLevel = Lowercase<LogLevel>;

export type SetSelectedLogStateType = Dispatch<SetStateAction<TraceActivityTreeNode | LogItem> | null>;

export type LogsInCallsContextType = {
  setSelectedLog: Dispatch<SetStateAction<TraceActivityTreeNode | LogItem> | null>;
  selectedLog: TraceActivityTreeNode | LogItem | null;
  timeConfigForLogs: TimeConfig | null;
  items: LogItem[];
  errors?: Error[];
  progress?: Progress;
};
