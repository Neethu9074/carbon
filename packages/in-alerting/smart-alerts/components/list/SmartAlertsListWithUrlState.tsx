/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import SmartAlertsBaseList, {
  SmartAlertsBaseListProps,
  TableState
} from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import useUrlState, { Options } from 'in-hooks/useUrlState';

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

export default function SmartAlertsListWithUrlState<AlertConfig extends AlertConfigType>(
  props: Omit<SmartAlertsBaseListProps<AlertConfig>, 'externalState' | 'setExternalState'> & { alertsTab: string }
) {
  const [state, setState] = useUrlState(urlStateDefinition(props.alertsTab));

  return <SmartAlertsBaseList {...props} externalState={state} setExternalState={setState} />;
}
