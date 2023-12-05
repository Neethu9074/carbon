/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import oldTheme from 'in-themes';

export const getLabel = ({ name }: { name: string }) => {
  const label = JSON.parse(name);

  if (typeof label === 'string') return label;
  else return null;
};

export const GROUP_COLORS = (() => {
  const maxGroupsOnChart = Math.min(5, oldTheme.lib.colors.chart.strokeColors100.length);
  return oldTheme.lib.colors.chart.strokeColors100.slice(0, maxGroupsOnChart);
})();

export const clickhouseTimeoutErrorMessage = 'Clickhouse timeout';
