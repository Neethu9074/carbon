/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { themes } from '@instana/design-tokens';

export const colorFormatter = function Color(value) {
  switch (value) {
    case 'Green':
    case 'ACTIVE':
    case 'active':
    case 'Active':
      return themes.default.ids.color.option.green['500'];
    case 'Yellow':
      return themes.default.ids.color.option.yellow['500'];
    case 'Red':
    case 'INACTIVE':
    case 'inactive':
    case 'Inactive':
      return themes.default.ids.color.option.red['500'];
    default:
      return themes.default.ids.color.option.neutral['400'];
  }
};
