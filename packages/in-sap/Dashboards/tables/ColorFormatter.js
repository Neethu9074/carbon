/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import theme from 'in-themes';

export const colorFormatter = function (value) {
  switch (value) {
    case 'Green':
    case 'ACTIVE':
    case 'active':
      return theme.lib.colors.success;
    case 'Yellow':
      return theme.lib.colors.yellow800;
    case 'Red':
    case 'INACTIVE':
    case 'inactive':
      return theme.lib.colors.failure;
    default:
      return theme.lib.colors.N400;
  }
};
