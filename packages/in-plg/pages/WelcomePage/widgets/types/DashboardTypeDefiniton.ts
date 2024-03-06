/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';
import { TimeConfig } from '@instana/types';

import { dashboardTileParamProps } from 'in-plg/pages/WelcomePage/PageContent';

export type GetContentFunction = (options: any) => React.ReactNode;

export type GetItemsFunction = (options: {
  timeConfig?: TimeConfig;
  query: string;
  infraType?: string;
  selectedType?: string;
  syntheticType?: string;
}) => Observable<any>;

export type AddMoreFunction = () => void;

export interface ApplicationProps {
  config: any;
  timeConfig: TimeConfig;
  applicationId: string;
  widgetLabel: string;
  dashboardTileProps?: dashboardTileParamProps;
}

export interface WidgetProps {
  config: any;
  timeConfig: TimeConfig;
  widgetLabel: string;
  dashboardTileProps: dashboardTileParamProps;
}

export interface InfraProps {
  config: any;
  timeConfig: any;
  infraType: string;
  widgetLabel: string;
  dashboardTileProps: dashboardTileParamProps;
}

export interface DatatableWidgetProps {
  headers: [];
  getItems: GetItemsFunction;
  timeConfig: TimeConfig;
  columnDefinitions: [];
  hasAddMore?: boolean;
  viewAll?: boolean;
  addMore: AddMoreFunction;
  addData: AddMoreFunction;
  href?: string;
  infraType?: string;
  label: string;
  syntheticType?: string;
  dashboardTileProps: dashboardTileParamProps;
  isDashboardWidget?: boolean;
}
