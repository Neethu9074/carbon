/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useContext, createContext } from 'react';

import { LogsInCallsContextType } from 'in-logging/components/types';

const LogsInCallsContext = createContext<LogsInCallsContextType>({
  setSelectedLog: () => {},
  selectedLog: null,
  timeConfigForLogs: null,
  items: []
});

export const useLogsInCallsContext = (): LogsInCallsContextType => useContext(LogsInCallsContext);

export default LogsInCallsContext;
