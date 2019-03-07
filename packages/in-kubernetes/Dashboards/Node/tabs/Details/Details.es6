import React from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import { singletonNavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import { nodeDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import Meta from 'in-kubernetes/Dashboards/Node/tabs/Details/Meta';
import IPs from 'in-kubernetes/Dashboards/Node/tabs/Details/IPs';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ data: node }) => ({ annotations: getAnnotations(node.id) }), function Details({
  data: node,
  annotations,
  timeConfig
}) {
  return (
    <DetailsNavigation
      navigationTree={navigationTree}
      resource={node}
      annotations={annotations}
      timeConfig={timeConfig}
    />
  );
});

const navigationItems = [
  ipNavigationItem(nodeDashboardDetailsFullyQualified),
  metaNavigationItem(`${nodeDashboardDetailsFullyQualified}/meta`),
  labelsNavigationItem(`${nodeDashboardDetailsFullyQualified}/labels`),
  annotationsNavigationItem(`${nodeDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${nodeDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);

function ipNavigationItem(path) {
  return {
    path,
    icon: 'lib_kubernetes_ip',
    label: 'IPs',
    component: IPs
  };
}

function metaNavigationItem(path) {
  return {
    path,
    icon: 'lib_kubernetes_annotation',
    label: 'Meta',
    component: Meta
  };
}
