/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TileButtonTypes } from 'in-plg/components/HeaderItemTile/types';

export function getValidButtonType(buttonType?: string): (typeof TileButtonTypes)[number] {
  if (buttonType && TileButtonTypes.includes(buttonType as any)) {
    return buttonType as any;
  } else {
    return 'primary';
  }
}
