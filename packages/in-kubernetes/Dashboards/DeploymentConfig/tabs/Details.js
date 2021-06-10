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
import { deploymentConfigDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import { singletonNavigationTree } from 'in-components/layout/SideNavigationAndContent';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ data: deploymentConfig }) => ({ annotations: getAnnotations(deploymentConfig.id) }),
  function Details({ data: deploymentConfig, annotations, timeConfig }) {
    return (
      <DetailsNavigation
        navigationTree={navigationTree}
        resource={deploymentConfig}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    );
  }
);

const navigationItems = [
  labelsNavigationItem(deploymentConfigDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${deploymentConfigDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${deploymentConfigDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);
