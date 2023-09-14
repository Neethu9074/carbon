/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { Group, Order, TagFilterExpressionElementUnion } from 'in-types';

export interface Grouping extends Group {
  tagType: string;
}

export interface TableFormConfiguration {
  source: string;
  dynamicFocusQuery?: string;
  columns?: string[];
  tableSize?: number;
  entityType?: string;
  tagFilterExpression: FormModelElement[] | TagFilterExpressionElementUnion;
  grouping?: Grouping[];
  datasets?: any;
  sorting?: Order;
  countGroup?: boolean;
}

export interface TableWidgetProps {
  config: TableFormConfiguration;
  title?: string;
  dragHandle?: React.ReactNode;
  actions?: React.ReactNode;
  isPreview: boolean;
  refreshFixatedTimeConfig: () => void;
}
