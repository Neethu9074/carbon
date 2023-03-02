/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { alertsTab } from 'in-applications/navigation/paths';
import { categoryGlobal } from 'in-alerting/smart-alerts/applications/list/constants';
import { alertsCategory } from 'in-applications/navigation/matrix';
import useUrlState from 'in-hooks/useUrlState';

export function useUrlBasedCategory(initialCategory: string) {
  const urlStateDefinition = {
    bind: [
      {
        path: alertsTab,
        name: alertsCategory,
        as: 'configsCategory',
        initialState: initialCategory
      }
    ],
    resets: [
      {
        bind: [
          {
            path: alertsTab,
            name: 'configsCategory'
          }
        ],
        reset: {}
      }
    ]
  };

  const [state, setState] = useUrlState<{ configsCategory: string }>(urlStateDefinition);
  const { configsCategory } = state;
  const setConfigsCategory = (configsCategory: string) => setState({ configsCategory });
  const isGlobalSmartAlertConfig = configsCategory === categoryGlobal;

  return [configsCategory, setConfigsCategory, isGlobalSmartAlertConfig];
}
