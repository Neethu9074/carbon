/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { chartColors } from 'in-themes/chartColors';

export const getLabel = ({ name }: { name: string }) => {
  const label = JSON.parse(name);

  if (typeof label === 'string') return label;
  else return null;
};

export const GROUP_COLORS = (() => {
  const maxGroupsOnChart = Math.min(5, chartColors.strokeColors100.length);
  return chartColors.strokeColors100.slice(0, maxGroupsOnChart);
})();

export const clickhouseTimeoutErrorMessage = 'Clickhouse timeout';

export const twoDigitApproximation = (v: number): number => {
  if (v === 0) return 0;
  const order = Math.floor(Math.log10(Math.abs(v)));
  if (order === 0) {
    return v > 5 ? 10 : v;
  }
  if (order === 1) {
    const lastDigit = v % 10;
    const rounded = lastDigit >= 5 ? Math.ceil(v / 10) * 10 : Math.floor(v / 10) * 10;
    return rounded;
  }
  const factor = Math.pow(10, order - 1);
  const approximated = Math.round(v / factor) * factor;
  return approximated;
};
