/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function oTelK8sContainerInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sContainer.entityType')}>
        {data.get('resource.k8s.entity.type')}
      </DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.oTelK8sContainer.platform')}>
        {data.get('resource.k8s.platform')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sContainer.address')}>
        {data.get('resource.server.address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sContainer.port')}>
        {data.get('resource.server.port')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sContainer.serviceName')}>
        {data.get('resource.server.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sContainer.instanceId')}>
        {data.get('resource.service.instance.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sContainer.runtimeVersion')}>
        {data.get('resource.process.runtime.version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sContainer.runtimeDesc')}>
        {data.get('resource.process.runtime.description')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sContainer.exePath')}>
        {data.get('resource.process.executable.path')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sContainer.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
