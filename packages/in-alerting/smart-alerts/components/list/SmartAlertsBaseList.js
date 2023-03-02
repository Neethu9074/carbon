/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import MultiCategoryAlertsList from 'in-alerting/smart-alerts/applications/list/SmartAlertsBaseList';
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

export default function SmartAlertsBaseList(props) {
  const [state, setState] = useUrlState(urlStateDefinition);

  return <MultiCategoryAlertsList {...props} externalState={state} setExternalState={setState} />;
}
