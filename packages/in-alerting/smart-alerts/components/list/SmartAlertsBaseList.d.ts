/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ColumnizedDefinition } from '@instana/components';
import { Observable } from '@instana/observables';

import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { SortOption } from 'in-components/SortingConfigurator/SortingConfigurator';
import { Location } from 'in-stores/navigation/types';
import { Result } from 'in-types';

interface Props<AlertConfig extends AlertConfigType> {
  getLocalAlertConfigsFetchFunction: () => Observable<Result<AlertConfig[]>>;
  getGlobalAlertConfigFetchFunction?: () => Observable<Result<AlertConfig[]>>;
  getLocalAlertConfigTitle: (numberOfAlerts: string) => string;
  getGlobalAlertConfigTitle?: (numberOfAlerts: string) => string;
  columnDefinitions: ColumnizedDefinition[];
  pageSize?: number;
  createRowLinkLocation?: (config: AlertConfig, location: Location) => Location;
  configsCategory?: string;
  setConfigsCategory?: (a: string) => void;
  sortOptions?: SortOption[];
  extraSearchAttributes?: string | ((entity: AlertConfig) => string) | (string | ((entity: AlertConfig) => string))[];
}

export default function SmartAlertsBaseList<AlertConfig extends AlertConfigType>(
  props: Props<AlertConfig>
): JSX.Element;

export function refreshSmartAlertConfigsList(): void;
