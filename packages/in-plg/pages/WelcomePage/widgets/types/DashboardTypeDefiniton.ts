/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ContextScope, OrderDirection, Progress, TagFilter, TagFilterExpression, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

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
  mainPage?: boolean; // This will modify the component to be used for a whole page, will enable pagination.
}

export type GetItemsFunction = (options: {
  timeConfig?: TimeConfig;
  query?: string;
  infraType?: string;
  selectedType?: string;
  syntheticType?: string;
  pinnedItemIdsByType?: StarredItemWithIdsType;
  page?: number;
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
  nonDeletedFavoriteCount: number;
  tableType: string;
  headers: {
    header: string;
    key: string;
  }[];
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
  mainPage?: boolean;
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
  serviceLevelObjective?: string[];
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

export interface ToggleType {
  index: number;
  icon?: string;
  label: string;
  value: string;
}

export interface GetTestSummaryList {
  timeConfig: TimeConfig;
  orderBy: string;
  orderDirection: OrderDirection;
  page: number;
  pageSize: number;
  query: string;
  progress: Progress;
  context?: string;
  appId?: string;
  websiteId?: string;
  mobileAppId?: string;
  syntheticTypes?: string[];
  locationIds?: string[];
  applicationIds?: string[];
  entityIds?: string[];
  associations?: Record<string, string[]>;
  mobileAppIds?: string[];
  excludeIds?: string[];
}

export type GetLocationData = {
  timeConfig: TimeConfig;
  orderBy: string;
  orderDirection: OrderDirection;
  progress: Progress;
  page: number;
  pageSize: number;
  query: string;
  locationTypes?: string[];
};

export interface GetApplicationsWithDefaultsProps {
  timeConfig: TimeConfig;
  query: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: OrderDirection;
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  contextScope: ContextScope;
  tagFilters?: TagFilter[];
  tagFilterExpression?: TagFilterExpression;
}
