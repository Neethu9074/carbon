/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { KubernetesAnnotation, KubernetesPersistentVolume, TimeConfig } from '@instana/types';

//@ts-expect-error TS migration
import DetailsNavigation, * as navUtils from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
//@ts-expect-error TS migration
import { singletonNavigationTree } from 'in-components/layout/SideNavigationAndContent';
//@ts-expect-error TS migration
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import { persistentVolumeDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
//@ts-expect-error TS migration
import connectTo from 'in-hoc/connectTo';

interface DetailsProps {
  data: KubernetesPersistentVolume;
  annotations: KubernetesAnnotation;
  timeConfig: TimeConfig;
}

export default connectTo(
  ({ data: persistentVolume }: DetailsProps) => ({ annotations: getAnnotations(persistentVolume.id) }),
  function Details({ data: persistentVolume, annotations, timeConfig }: DetailsProps) {
    return (
      <DetailsNavigation
        navigationTree={navigationTree}
        resource={persistentVolume}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    );
  }
);

const navigationItems = [
  navUtils.labelsNavigationItem(persistentVolumeDashboardDetailsFullyQualified),
  navUtils.annotationsNavigationItem(`${persistentVolumeDashboardDetailsFullyQualified}/annotations`),
  navUtils.specNavigationItem(`${persistentVolumeDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);

const navigationTree = singletonNavigationTree(navigationItems);
