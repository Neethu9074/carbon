/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { TraceActivityTreeNode, LogItem } from '@instana/types/typeDefinitions';
import { Progress, TimeConfig } from '@instana/types';

const LogsInCallsContext = React.createContext<{
  setSelectedLog: React.Dispatch<React.SetStateAction<TraceActivityTreeNode | LogItem> | null>;
  selectedLog: null | TraceActivityTreeNode | LogItem;
  timeConfigForLogs: null | TimeConfig;
  items: LogItem[];
  errors?: Error[];
  progress?: Progress;
}>({
  setSelectedLog: () => {},
  selectedLog: null,
  timeConfigForLogs: null,
  items: []
});

export const useLogsInCallsContext = () => {
  return useContext(LogsInCallsContext);
};

export default LogsInCallsContext;
