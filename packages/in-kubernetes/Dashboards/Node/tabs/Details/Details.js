/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import { singletonNavigationTree } from 'in-components/layout/SideNavigationAndContent';
import { nodeDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import IPs from 'in-kubernetes/Dashboards/Node/tabs/Details/IPs';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ data: node }) => ({ annotations: getAnnotations(node.id) }),
  function Details({ data: node, annotations, timeConfig }) {
    return (
      <DetailsNavigation
        navigationTree={navigationTree}
        resource={node}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    );
  }
);

const navigationItems = [
  labelsNavigationItem(nodeDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${nodeDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${nodeDashboardDetailsFullyQualified}/spec`),
  ipNavigationItem(`${nodeDashboardDetailsFullyQualified}/ips`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);

function ipNavigationItem(path) {
  return {
    path,
    icon: 'lib_kubernetes_ip',
    label: t('in-kubernetes:dashboards.iPs'),
    component: IPs
  };
}
