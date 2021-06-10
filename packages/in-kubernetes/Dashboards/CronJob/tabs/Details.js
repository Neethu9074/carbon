/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import { singletonNavigationTree } from 'in-components/layout/SideNavigationAndContent';
import { cronJobDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import getAnnotations from 'in-kubernetes/components/getAnnotations';

export default function Details({ data: cronJob, timeConfig }) {
  const annotations = useObservable(getAnnotations(cronJob.id), [cronJob.id]);
  return (
    <DetailsNavigation
      navigationTree={navigationTree}
      resource={cronJob}
      annotations={annotations}
      timeConfig={timeConfig}
    />
  );
}

const navigationItems = [
  labelsNavigationItem(cronJobDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${cronJobDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${cronJobDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);
