/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, timeout } from '@instana/observables';

const convertToNormalChildren = items => items;

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
    label: 'First Level Node (app)',
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
  label: 'Root Level Leaf',
  icon: 'lib_infra_host'
};

export const options = [{ ...leafNode }, { ...nodeWithKids }];

export function optionsWithBreadCrumbLabels() {
  return options.map(o => ({ ...o, breadcrumbAndLabel: 'breadcrumbAndLabel' }));
}
