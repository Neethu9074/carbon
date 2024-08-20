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
  key?: string;
  config?: any;
  timeConfig?: TimeConfig;
  widgetLabel?: string;
  dashboardTileProps: DashboardTileParamProps;
  maxItems?: number | null;
  viewAll?: boolean;
}

export type GetItemsFunction = (options: {
  timeConfig?: TimeConfig;
  query?: string;
  infraType?: string;
  selectedType?: string;
  syntheticType?: string;
  pinnedItemIdsByType?: StarredItemWithIdsType;
  pageSize?: number;
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
  tableType: string;
  headers: [];
  getItem: (options: any) => Observable<any>;
  getItems: GetItemsFunction;
  addMore: AddMoreFunction;
  addData: AddMoreFunction;
  columnDefinitions: ColumnDefinitionItem[];
  hasAddMore?: boolean;
  hasAddPermission?: boolean;
  viewAll?: boolean;
  href?: string;
  label: string;
  isDashboardWidget?: boolean;
  pinnedItemIdsByType?: StarredItemWithIdsType;
  pinnedItemTypes?: (keyof StarredItemWithIdsType)[];
  timeConfig: TimeConfig;
  searchPlaceholderLabel: string;
  addButtonLabel: string;
  viewAllLabel: string;
}

export interface StarredItemWithIdsType {
  host?: string[];
  container?: string[];
  process?: string[];
  kubernetesCluster?: string[];
  pcfApplication?: string[];
  vsphereDatacenter?: string[];
  openstackRegion?: string[];
  phmcServer?: string[];
  powervc?: string[];
  zhmcServer?: string[];
  sap?: string[];
  application?: string[];
  service?: string[];
  website?: string[];
  mobileApp?: string[];
  businessProcess?: string[];
}

export interface StarredItemType {
  id?: string;
  label?: string;
  type: string;
}

export interface ColumnDefinitionItem {
  key: string;
  getContent: GetContentFunction;
}

export interface SyntheticInfraColumn {
  [key: string]: ColumnDefinitionItem[];
}
