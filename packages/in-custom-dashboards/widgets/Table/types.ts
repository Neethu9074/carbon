/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export interface TableFormConfiguration {
  source: string;
  dynamicFocusQuery?: string;
  columns?: string[];
  tableSize?: number;
  entityType?: string;
}

export interface TableWidgetProps {
  config: TableFormConfiguration;
  title?: string;
  dragHandle?: React.ReactNode;
  actions?: React.ReactNode;
  isPreview: boolean;
}
