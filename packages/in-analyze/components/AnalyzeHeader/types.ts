/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';
import { TagCatalog } from '@instana/types';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { ContextConfiguration } from 'in-components/DashboardHeader/DashboardHeader';
import { Entity, ProductArea } from 'in-analyze/AnalyzeView/dataSources';

export interface DataSource {
  enabled: boolean;
  getHref$: (isGrouped: boolean, formModel: FormModelElement, callTagsCatalog: TagCatalog) => Observable<string>;
  dataSource: string;
}

export interface ActiveConfiguration {
  beta?: boolean;
  productArea: ProductArea;
  dataSource: Entity;
  ua2: boolean;
}

export interface AnalyzeHeaderProps {
  renderQuickFilterBar?: () => JSX.Element;
  isGrouped: boolean;
  withoutShadow?: boolean;
  formModel?: FormModelElement[] | readonly never[];
  label?: string | JSX.Element;
  headerHref$?: Observable<string>;
  onHeaderClick?: (params: any) => any;
  contextConfigurations?: ContextConfiguration[];
  liveModeDisabled?: boolean;
  liveModeDisabledTooltip?: string;
  showTimeSelection?: boolean;
}

export interface LabelProps {
  activeConfiguration: ActiveConfiguration;
}

export type DataSourceMatrix = {
  matrixPath: string;
  matrixParam: string;
  productArea: ProductArea;
  pathPrefix?: string;
};
