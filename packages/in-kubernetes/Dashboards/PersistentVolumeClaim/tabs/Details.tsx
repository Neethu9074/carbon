/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { KubernetesAnnotation, KubernetesPersistentVolumeClaim, TimeConfig } from '@instana/types';

//@ts-expect-error TS migration
import DetailsNavigation, * as navUtils from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
//@ts-expect-error TS migration
import { singletonNavigationTree } from 'in-components/layout/SideNavigationAndContent';
//@ts-expect-error TS migration
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import { persistentVolumeClaimDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
//@ts-expect-error TS migration
import connectTo from 'in-hoc/connectTo';

interface DetailsProps {
  data: KubernetesPersistentVolumeClaim;
  annotations: KubernetesAnnotation;
  timeConfig: TimeConfig;
}

export default connectTo(
  ({ data: persistentVolumeClaim }: DetailsProps) => ({ annotations: getAnnotations(persistentVolumeClaim.id) }),
  function Details({ data: persistentVolumeClaim, annotations, timeConfig }: DetailsProps) {
    return (
      <DetailsNavigation
        navigationTree={navigationTree}
        resource={persistentVolumeClaim}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    );
  }
);

const navigationItems = [
  navUtils.labelsNavigationItem(persistentVolumeClaimDashboardDetailsFullyQualified),
  navUtils.annotationsNavigationItem(`${persistentVolumeClaimDashboardDetailsFullyQualified}/annotations`),
  navUtils.specNavigationItem(`${persistentVolumeClaimDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);
