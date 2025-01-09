/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function oTelK8sPodInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sPod.entityType')}>
        {data.get('resource.k8s.entity.type')}
      </DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.oTelK8sPod.platform')}>
        {data.get('resource.k8s.platform')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sPod.address')}>
        {data.get('resource.server.address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sPod.port')}>
        {data.get('resource.server.port')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sPod.serviceName')}>
        {data.get('resource.server.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sPod.instanceId')}>
        {data.get('resource.service.instance.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sPod.runtimeVersion')}>
        {data.get('resource.process.runtime.version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sPod.runtimeDesc')}>
        {data.get('resource.process.runtime.description')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sPod.exePath')}>
        {data.get('resource.process.executable.path')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sPod.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
