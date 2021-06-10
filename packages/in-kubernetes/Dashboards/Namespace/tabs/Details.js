/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import { namespaceDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import { singletonNavigationTree } from 'in-components/layout/SideNavigationAndContent';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ data: namespace }) => ({ annotations: getAnnotations(namespace.id) }),
  function Details({ data: namespace, annotations, timeConfig }) {
    return (
      <Fragment>
        <DetailsNavigation
          navigationTree={navigationTree}
          resource={namespace}
          annotations={annotations}
          timeConfig={timeConfig}
        />
      </Fragment>
    );
  }
);

const navigationItems = [
  labelsNavigationItem(namespaceDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${namespaceDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${namespaceDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);
