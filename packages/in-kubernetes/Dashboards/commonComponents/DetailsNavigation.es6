// @flow
import React from 'react';

import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import Annotations from 'in-kubernetes/Dashboards/commonComponents/Annotations';
import type { Page } from 'in-new-components/layout/SideNavigationAndContent';
import Spec from 'in-kubernetes/Dashboards/commonComponents/Spec';

export default function DetailsNavigation({ navigationTree, resource, ...props }) {
  return <SideNavigationAndContent navigationTree={navigationTree} sidebarWidth={3} resource={resource} {...props} />;
}

export function labelsNavigationItem(path: string): Page {
  return {
    path,
    icon: 'lib_kubernetes_label',
    renderLabel: ({ resource }) => `Labels (${resource.labels.length})`,
    component: ({ resource }) => (
      <KeyValueList title="Labels" icon="lib_kubernetes_label" items={resource.labels} onEmptyText="No Labels" />
    )
  };
}

export function annotationsNavigationItem(path: string): Page {
  return {
    path,
    icon: 'lib_kubernetes_annotation',
    renderLabel: ({ annotations }) => `Annotations (${annotations ? annotations.length : 0})`,
    component: ({ annotations }) => <Annotations annotations={annotations} onEmptyText="No Annotations" />
  };
}

export function specNavigationItem(path: string): Page {
  return {
    path,
    icon: 'lib_kubernetes_spec',
    label: 'Spec',
    component: ({ resource }) => <Spec snapshotId={resource.id} />
  };
}
