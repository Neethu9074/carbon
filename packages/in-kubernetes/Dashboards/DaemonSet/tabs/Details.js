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
import { daemonSetDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import { singletonNavigationTree } from 'in-components/layout/SideNavigationAndContent';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ data: daemonSet }) => ({ annotations: getAnnotations(daemonSet.id) }),
  function Details({ data: daemonSet, annotations, timeConfig }) {
    return (
      <DetailsNavigation
        navigationTree={navigationTree}
        resource={daemonSet}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    );
  }
);

const navigationItems = [
  labelsNavigationItem(daemonSetDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${daemonSetDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${daemonSetDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);
