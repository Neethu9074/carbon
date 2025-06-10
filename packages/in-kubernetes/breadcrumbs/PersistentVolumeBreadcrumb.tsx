/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

//@ts-expect-error TS migration
import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import getKubernetesPersistentVolume from 'in-kubernetes/subscriptions/getKubernetesPersistentVolume';
//@ts-expect-error TS migration
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { EntityHealthInfo, KubernetesPersistentVolume, TimeConfig } from 'in-types';
//@ts-expect-error TS migration
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

interface PersistentVolumeBreadcrumbProps {
  persistentVolumeId: string;
  persistentVolume: KubernetesPersistentVolume;
  href: string;
}

export default connectTo(
  ({ persistentVolumeId: id, timeConfig }: { persistentVolumeId: string; timeConfig: TimeConfig }) => ({
    persistentVolume: getKubernetesPersistentVolume({
      id,
      timeConfig
    }).map(result => result.data)
  }),
  function PersistentVolumeBreadcrumb({ persistentVolumeId, persistentVolume, href }: PersistentVolumeBreadcrumbProps) {
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={persistentVolumeId}
        render={(healthInfo: EntityHealthInfo) => (
          <Breadcrumb
            label={t('in-kubernetes:breadcrumbs.persistentVolume')}
            icon="lib_infra_kubernetesPersistentVolume"
            snapshotId={persistentVolumeId}
            href={href}
            healthInfo={healthInfo}
          >
            {persistentVolume?.name}
          </Breadcrumb>
        )}
      />
    );
  }
);
