/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Group, Order, TagFilterExpressionElementUnion } from 'in-types';

export interface Grouping extends Group {
  tagType: string;
}

export type WidgetSource =
  | 'APDEX'
  | 'APPLICATION'
  | 'BIZOPS'
  | 'EUM'
  | 'EVENT'
  | 'INFRASTRUCTURE_METRICS'
  | 'LOG'
  | 'MOBILE_APP'
  | 'SLI'
  | 'SLO'
  | 'SLO_PREVIEW'
  | 'SYNTHETICS_DETAIL'
  | 'SYNTHETICS'
  | 'UNKNOWN'
  | 'USAGE'
  | 'WEBSITE';

export interface TableFormConfiguration {
  source: WidgetSource;
  dynamicFocusQuery?: string;
  columns?: string[];
  tableSize?: number;
  entityType?: string;
  tagFilterExpression: TagFilterExpressionElementUnion;
  grouping?: Grouping[];
  datasets?: any;
  sorting?: Order;
  countGroup?: boolean;
  showGroupsWithMissingTags?: boolean;
}

export interface TableWidgetProps {
  config: TableFormConfiguration;
  title?: string;
  dragHandle?: React.ReactNode;
  actions?: React.ReactNode;
  isPreview: boolean;
  isInModal?: boolean;
  refreshFixatedTimeConfig: () => void;
}
