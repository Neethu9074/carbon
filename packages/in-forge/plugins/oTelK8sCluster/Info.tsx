/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function OTelK8sClusterInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sCluster.entityType')}>
        {data.get('resource.k8sCluster.entity.type')}
      </DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.oTelK8sCluster.platform')}>
        {data.get('resource.k8s.platform')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sCluster.address')}>
        {data.get('resource.server.address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sCluster.port')}>
        {data.get('resource.server.port')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sCluster.serviceName')}>
        {data.get('resource.server.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sCluster.instanceId')}>
        {data.get('resource.service.instance.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sCluster.runtimeVersion')}>
        {data.get('resource.process.runtime.version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sCluster.runtimeDesc')}>
        {data.get('resource.process.runtime.description')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sCluster.exePath')}>
        {data.get('resource.process.executable.path')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sCluster.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
