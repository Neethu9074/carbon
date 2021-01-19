/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';
import Annotations from 'in-kubernetes/Dashboards/commonComponents/Annotations';
import Spec from 'in-kubernetes/Dashboards/commonComponents/Spec';

export default function DetailsNavigation({ navigationTree, resource, ...props }) {
  return <SideNavigationAndContent navigationTree={navigationTree} sidebarWidth={3} resource={resource} {...props} />;
}

export function labelsNavigationItem(path) {
  return {
    path,
    icon: 'lib_kubernetes_label',
    renderLabel: ({ resource }) => `Labels (${resource.labels.length})`,
    component: function LabelsNavigationItem({ resource }) {
      return <KeyValueList title="Labels" items={resource.labels} onEmptyText="No Labels" />;
    }
  };
}

export function annotationsNavigationItem(path) {
  return {
    path,
    icon: 'lib_kubernetes_annotation',
    renderLabel: ({ annotations }) => `Annotations (${annotations ? annotations.length : 0})`,
    component: function AnnotationsNavigationItem({ annotations }) {
      return <Annotations annotations={annotations} onEmptyText="No Annotations" />;
    }
  };
}

export function specNavigationItem(path) {
  return {
    path,
    icon: 'lib_kubernetes_spec',
    label: 'Spec',
    component: function SpecNavigationItem({ resource }) {
      return <Spec snapshotId={resource.id} />;
    }
  };
}
