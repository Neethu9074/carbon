/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Observable } from '@instana/observables';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { categoryGlobal, categoryLocal } from 'in-alerting/smart-alerts/components/list/constants';
import SmartAlertsTableView from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import useUrlState, { Options } from 'in-hooks/useUrlState';
import { Result } from 'in-types';

export type TableState = Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns' | 'pageSize'>;

const urlStateDefinition = (alertsTab: string): Options<TableState> => {
  return {
    bind: [
      {
        path: alertsTab,
        name: 'orderBy',
        as: 'orderBy',
        initialState: 'created'
      },
      {
        path: alertsTab,
        name: 'orderDirection',
        as: 'orderDirection',
        initialState: 'DESC'
      },
      {
        path: alertsTab,
        name: 'page',
        as: 'page',
        initialState: 1,
        parser: intParser
      },
      {
        path: alertsTab,
        name: 'query',
        as: 'query',
        initialState: ''
      }
    ],
    resets: [
      {
        bind: [
          {
            path: alertsTab,
            name: 'orderBy'
          },
          {
            path: alertsTab,
            name: 'orderDirection'
          }
        ],
        reset: { page: 1 }
      }
    ]
  };
};

export type AlertFetchFunction<AlertConfig extends AlertConfigType> = () => Observable<Result<AlertConfig[]>>;

type ExtraSearchAttributes<AlertConfig extends AlertConfigType> = ((entity: AlertConfig) => string)[];

export interface SmartAlertsTableViewProps<AlertConfig extends AlertConfigType> {
  getLocalAlertConfigsFetchFunction: AlertFetchFunction<AlertConfig>;
  getGlobalAlertConfigFetchFunction?: AlertFetchFunction<AlertConfig>;
  getLocalAlertConfigTitle: (numberOfAlerts: number) => string;
  getGlobalAlertConfigTitle?: (numberOfAlerts: number) => string;
  columnDefinitions: ColumnDefinition<AlertConfig>[];
  pageSize?: number;
  configsCategory?: typeof categoryLocal | typeof categoryGlobal;
  setConfigsCategory?: (a: string) => void;
  extraSearchAttributes?: ExtraSearchAttributes<AlertConfig>;
  onNoData?: () => void;
  externalState: TableState;
  setExternalState: (state: Partial<TableState>) => void;
  toolBarContent?: JSX.Element;
  isSelectable?: boolean;
  noDataHeader?: string;
  noDataDescription?: string;
}

export default function SmartAlertsTableWithUrlState<AlertConfig extends AlertConfigType>(
  props: Omit<SmartAlertsTableViewProps<AlertConfig>, 'externalState' | 'setExternalState'> & { alertsTab: string }
) {
  const [state, setState] = useUrlState(urlStateDefinition(props.alertsTab));

  return <SmartAlertsTableView {...props} externalState={state} setExternalState={setState} />;
}
