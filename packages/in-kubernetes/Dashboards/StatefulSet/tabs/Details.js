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
import { singletonNavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import { statefulSetDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ data: statefulSet }) => ({ annotations: getAnnotations(statefulSet.id) }),
  function Details({ data: statefulSet, annotations, timeConfig }) {
    return (
      <DetailsNavigation
        navigationTree={navigationTree}
        resource={statefulSet}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    );
  }
);

const navigationItems = [
  labelsNavigationItem(statefulSetDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${statefulSetDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${statefulSetDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);
