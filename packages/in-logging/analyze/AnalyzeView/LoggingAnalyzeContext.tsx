/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface State {
  extraChartLogLevel?: string;
}

interface ContextValue {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const defaultValue = {
  extraChartLogLevel: ''
};

const LoggingAnalyzeContext = createContext<ContextValue>({ state: {}, setState: () => {} });
export function useLoggingAnalyzeContext() {
  return useContext<ContextValue>(LoggingAnalyzeContext);
}

export function LoggingAnalyzeContextWrapper({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(defaultValue);

  const value = useMemo(() => {
    return { state, setState };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.extraChartLogLevel]);

  return <LoggingAnalyzeContext.Provider value={value}>{children}</LoggingAnalyzeContext.Provider>;
}
