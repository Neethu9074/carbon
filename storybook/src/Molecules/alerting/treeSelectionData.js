/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { timeout } from '@instana/observables';
import { createApOnlyItem } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/searchResults';

const loadingItems = items => () =>
  timeout(2000).map(() => ({
    data: {
      items
    }
  }));

export const firstLevelChildren = [
  {
    label: 'First Level Leaf',
    icon: 'lib_infra_docker'
  },
  {
    ...createApOnlyItem({
      applicationName: 'First Level Node (app)',
      applicationId: '0815'
    }),
    icon: 'lib_application',
    // for testing, swap next two lines to get static case
    loadChildren: loadingItems([
      {
        icon: 'lib_application_service',
        label: 'Second Level Leaf (svc)'
      },
      {
        label: 'Second Level Node (svc)',
        icon: 'lib_application_service',
        loadChildren: loadingItems([
          {
            label: 'Third Level Leaf (endpoint)',
            icon: 'lib_application_endpoint'
          }
        ])
      }
    ])
  }
];

export const nodeWithKids = {
  label: 'Root Level Node',
  icon: 'lib_infra_kubernetesNode',
  children: [...firstLevelChildren]
};

export const leafNode = {
  ...createApOnlyItem({
    applicationName: 'Root Level Leaf',
    applicationId: '0815'
  }),
  label: 'Root Level Leaf',
  icon: 'lib_infra_host'
};

export const options = [{ ...leafNode }, { ...nodeWithKids }];

export function optionsWithBreadCrumbLabels() {
  return options.map(o => ({ ...o, breadcrumbAndLabel: 'breadcrumbAndLabel' }));
}
