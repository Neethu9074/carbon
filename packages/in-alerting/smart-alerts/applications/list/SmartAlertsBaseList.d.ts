/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ColumnizedDefinition } from '@instana/components';
import { Observable } from '@instana/observables';

import { AlertConfigType } from 'in-alerting/smart-alerts/components/AlertsBaseList';
import { SortOption } from 'in-components/SortingConfigurator/SortingConfigurator';
import { Result } from 'in-types';

interface Props {
  getGlobalAlertConfigFetchFunction?: () => Observable<Result<AlertConfigType[]>>;
  getLocalAlertConfigsFetchFunction?: () => Observable<Result<AlertConfigType[]>>;
  columnDefinitions: ColumnizedDefinition[];
  pageSize?: number;
  createRowLinkLocation?: (config: AlertConfigType, location: Location) => Location;
  configsCategory?: string;
  setConfigsCategory?: (a: string) => void;
  sortOptions?: SortOption[];
  extraSearchAttributes?:
    | string
    | ((entity: AlertConfigType) => string)
    | (string | ((entity: AlertConfigType) => string))[];
}

export default function SmartAlertsBaseList(props: Props): JSX.Element;

export function refreshSmartAlertConfigsList(): void;
