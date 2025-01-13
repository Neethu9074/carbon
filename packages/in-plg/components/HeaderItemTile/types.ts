/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

export type HeaderItemTileProps = {
  title?: string;
  description?: string;
  buttonType?: (typeof TileButtonTypes)[number];
  buttonName?: string;
  href?: string;
  hasPermission?: boolean;
  onButtonClick?: () => void;
};

export const TileButtonTypes = [
  'primary',
  'tertiary',
  'secondary',
  'ghost',
  'danger',
  'danger--primary',
  'danger--ghost',
  'danger--tertiary'
] as const;
