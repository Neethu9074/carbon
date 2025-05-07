/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

export interface TileDataType {
  key: string;
  title: string;
  description: string;
  buttonName: string;
  buttonType: string;
  href?: string;
  hasPermission?: boolean;
  isActionCompleted?: boolean;
  onButtonClick: () => void;
}
