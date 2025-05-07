/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { getActiveConfiguration } from 'in-analyze/components/AnalyzeHeader/utils';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import AnalyzeView from 'in-logging/analyze/AnalyzeView/AnalyzeView';
import ConsoleView from 'in-logging/analyze/ConsoleView/ConsoleView';

export default function LoggingAnalytics() {
  const location = useLocation();
  const activeConfiguration = getActiveConfiguration(location);

  if (activeConfiguration.dataSource === 'logs') return <AnalyzeView />;
  if (activeConfiguration.dataSource === 'logsConsole') return <ConsoleView />;
  return null;
}
