/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import SmartAlertsBaseList from 'in-alerting/smart-alerts/applications/components/list/SmartAlertsBaseList';
import { categoryLocal } from 'in-alerting/smart-alerts/applications/components/list/constants';
import { alertsCategory } from 'in-applications/navigation/matrix';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { alertsTab } from 'in-applications/navigation/paths';
import useUrlState from 'in-hooks/useUrlState';

const urlStateDefinition = {
  bind: [
    {
      path: alertsTab,
      name: 'orderBy',
      as: 'orderBy',
      initialState: 'name'
    },
    {
      path: alertsTab,
      name: 'orderDirection',
      as: 'orderDirection',
      initialState: 'ASC'
    },
    {
      path: alertsTab,
      name: alertsCategory,
      as: 'configsCategory',
      initialState: categoryLocal // "local" or "global"
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
          name: 'configsCategory'
        },
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

export default function SmartAlertsBaseListWithUrlState(props) {
  const [state, setState] = useUrlState(urlStateDefinition);
  return <SmartAlertsBaseList {...props} externalState={state} setExternalState={setState} />;
}
