/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { chartColors } from 'in-themes/chartColors';

export const k8sChartColors = {
  running: chartColors.fourColorPalette[0],

  pending: chartColors.fourColorPalette[0],

  allocated: chartColors.fourColorPalette[1],

  usage: chartColors.threeColorPalette[0],

  limits: chartColors.threeColorPalette[1],

  requests: chartColors.threeColorPalette[2],

  hardLimits: chartColors.fiveColorPalette[2],

  hardRequests: chartColors.fiveColorPalette[0],

  pods: chartColors.strokeColors100[0],

  unscheduled: chartColors.fourColorPalette[2],

  unready: chartColors.fourColorPalette[3],

  available: chartColors.strokeColors100[0],

  desired: chartColors.strokeColors100[1],

  total: chartColors.threeColorPalette[0],

  used: chartColors.threeColorPalette[1]
};

export const k8sClusterChart = {
  pending: chartColors.fourColorPalette[1],
  allocated: chartColors.fourColorPalette[2],
  capacity: chartColors.fourColorPalette[3]
};

export const k8sNamespaceChart = {
  usage: chartColors.fiveColorPalette[4],
  requests: chartColors.fiveColorPalette[1],
  limits: chartColors.fiveColorPalette[3]
};

export const k8sNodeChart = {
  capacity: chartColors.fourColorPalette[0],
  limits: chartColors.fourColorPalette[1],
  usage: chartColors.fourColorPalette[2],
  requests: chartColors.fourColorPalette[3]
};

export const k8sPodAndServiceChart = {
  usage: chartColors.threeColorPalette[2],
  limits: chartColors.threeColorPalette[0],
  requests: chartColors.threeColorPalette[1]
};
