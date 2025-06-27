/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error TS migration
import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
// @ts-expect-error TS migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getOtelKubernetesPod from 'in-kubernetes/subscriptions/getOtelKubernetesPod';
// @ts-expect-error TS migration
import connectTo from 'in-hoc/connectTo';
import { EntityHealthInfo, KubernetesPod, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface OtelNodePodBreadcrumbProps {
  podId: string;
  pod: KubernetesPod;
  href: string;
}

export default connectTo(
  ({ podId: id, timeConfig }: { podId: string; timeConfig: TimeConfig }) => ({
    pod: getOtelKubernetesPod({
      id,
      timeConfig
    }).map(result => (result.data ? result.data : null))
  }),
  function OtelNodePodBreadcrumb({ podId, pod, href }: OtelNodePodBreadcrumbProps) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={podId}
        render={(healthInfo: EntityHealthInfo) => (
          <Breadcrumb
            label={t('in-kubernetes:breadcrumbs.pod')}
            icon="lib_kubernetes_pod"
            href={href}
            healthInfo={healthInfo}
          >
            {pod && pod.label}
          </Breadcrumb>
        )}
      />
    );
  }
);
