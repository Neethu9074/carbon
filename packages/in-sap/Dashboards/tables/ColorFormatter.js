/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useTheme } from 'in-themes';

export const colorFormatter = function Color(value) {
  const theme = useTheme();
  switch (value) {
    case 'Green':
    case 'ACTIVE':
    case 'active':
      return theme.ids.color.option.green['500'];
    case 'Yellow':
      return theme.ids.color.option.yellow['500'];
    case 'Red':
    case 'INACTIVE':
    case 'inactive':
      return theme.ids.color.option.red['500'];
    default:
      return theme.ids.color.option.neutral['400'];
  }
};
