/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just } from '@instana/observables';

const loadingItems = items => () =>
  just({
    data: {
      items
    }
  });

export const firstLevelChildren = () => [
  {
    label: 'First Level Leaf',
    description: 'Some description',
    icon: 'lib_infra_docker'
  },
  {
    label: 'First Level Node',
    description: 'Some description',
    icon: 'lib_infra_kubernetesService',
    // for testing, swap next two lines to get static case
    // children: ([
    loadChildren: loadingItems([
      {
        icon: 'lib_infra_httpd',
        label: 'Second Level Leaf'
      },
      {
        label: 'Second Level Node',
        description: 'Some description',
        icon: 'lib_infra_mule',
        children: [
          {
            label: 'Third Level Leaf',
            icon: 'lib_infra_endpoint',
            description: 'Some description'
          }
        ]
      }
    ])
  }
];

export const nodeWithKids = () => ({
  label: 'Root Level Node',
  description: 'Some description, hidden',
  icon: 'lib_infra_kubernetesNode',
  loadChildren: loadingItems(firstLevelChildren())
});

export const leafNode = () => ({
  label: 'Root Level Leaf',
  description: 'Some description',
  icon: 'lib_infra_host'
});

export const options = () => [leafNode(), nodeWithKids()];

export function optionsWithBreadCrumbLabels() {
  return options().map(o => ({ ...o, breadcrumbAndLabel: 'breadcrumbAndLabel' }));
}
