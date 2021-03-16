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
import { singletonNavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import { podDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import IPs from 'in-kubernetes/Dashboards/Pod/tabs/Details/IPs';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ data: pod }) => ({ annotations: getAnnotations(pod.id) }),
  function Details({ data: pod, annotations, timeConfig }) {
    return (
      <Fragment>
        <DetailsNavigation
          navigationTree={navigationTree}
          resource={pod}
          annotations={annotations}
          timeConfig={timeConfig}
        />
      </Fragment>
    );
  }
);

const navigationItems = [
  labelsNavigationItem(podDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${podDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${podDashboardDetailsFullyQualified}/spec`),
  ipNavigationItem(`${podDashboardDetailsFullyQualified}/ips`)
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
