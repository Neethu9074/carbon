/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

//@ts-expect-error TS migration
import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesPersistentVolumeClaim from 'in-kubernetes/subscriptions/getKubernetesPersistentVolumeClaim';
//@ts-expect-error TS migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { EntityHealthInfo, KubernetesPersistentVolumeClaim, TimeConfig } from 'in-types';
//@ts-expect-error TS migration
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

interface PersistentVolumeClaimBreadcrumbProps {
  persistentVolumeClaimId: string;
  persistentVolumeClaim: KubernetesPersistentVolumeClaim;
  href: string;
}

export default connectTo(
  ({ persistentVolumeClaimId: id, timeConfig }: { persistentVolumeClaimId: string; timeConfig: TimeConfig }) => ({
    persistentVolumeClaim: getKubernetesPersistentVolumeClaim({
      id,
      timeConfig
    }).map(result => result.data)
  }),
  function PersistentVolumeClaimBreadcrumb({
    persistentVolumeClaimId,
    persistentVolumeClaim,
    href
  }: PersistentVolumeClaimBreadcrumbProps) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={persistentVolumeClaimId}
        render={(healthInfo: EntityHealthInfo) => (
          <Breadcrumb
            label={t('in-kubernetes:breadcrumbs.persistentVolumeClaim')}
            icon="lib_infra_kubernetesPersistentVolumeClaim"
            snapshotId={persistentVolumeClaimId}
            href={href}
            healthInfo={healthInfo}
          >
            {persistentVolumeClaim?.name}
          </Breadcrumb>
        )}
      />
    );
  }
);
