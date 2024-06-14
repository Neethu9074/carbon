/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';
import { TimeConfig } from '@instana/types';

import { DashboardTileParamProps } from 'in-plg/pages/WelcomePage/PageContent';

export type GetContentFunction = (options: any) => React.ReactNode;

export interface WidgetProps {
  config: any;
  timeConfig: TimeConfig;
  widgetLabel: string;
  dashboardTileProps: DashboardTileParamProps;
  maxItems?: number;
  viewAll?: boolean;
}

export type GetItemsFunction = (options: {
  timeConfig?: TimeConfig;
  query: string;
  infraType?: string;
  selectedType?: string;
  syntheticType?: string;
}) => Observable<any>;

export type AddMoreFunction = () => void;

export interface ApplicationProps extends WidgetProps {
  applicationId: string;
}

export interface InfraProps extends WidgetProps {
  infraType: string;
}

export interface SyntheticProps extends WidgetProps {
  syntheticType: string;
}

export interface DatatableWidgetProps extends InfraProps, SyntheticProps {
  headers: [];
  getItems: GetItemsFunction;
  addMore: AddMoreFunction;
  addData: AddMoreFunction;
  columnDefinitions: [];
  hasAddMore?: boolean;
  hasAddPermission?: boolean;
  viewAll?: boolean;
  href?: string;
  label: string;
  isDashboardWidget?: boolean;
}

export interface ColumnDefinitionItem {
  key: string;
  getContent: GetContentFunction;
}

export interface SyntheticInfraColumn {
  [key: string]: ColumnDefinitionItem[];
}
