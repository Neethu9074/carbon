/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import theme from 'in-themes';

export const maxInitialLogLines = 200;
export const customChartHeight = 215;
export const maxRetrievalSize = 200;
export const logLevelColors = {
  error: theme.lib.colors.failure,
  warn: theme.lib.colors.warning,
  info: theme.lib.colors.lightBlue800,
  debug: theme.lib.colors.black,
  trace: theme.lib.colors.black
};
