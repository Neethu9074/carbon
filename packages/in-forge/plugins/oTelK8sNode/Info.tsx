/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function OTelK8sNodeInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sNode.entityType')}>
        {data.get('resource.k8sNode.entity.type')}
      </DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.oTelK8sNode.platform')}>
        {data.get('resource.k8s.platform')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sNode.address')}>
        {data.get('resource.server.address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sNode.port')}>
        {data.get('resource.server.port')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sNode.serviceName')}>
        {data.get('resource.server.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sNode.instanceId')}>
        {data.get('resource.service.instance.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sNode.runtimeVersion')}>
        {data.get('resource.process.runtime.version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sNode.runtimeDesc')}>
        {data.get('resource.process.runtime.description')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sNode.exePath')}>
        {data.get('resource.process.executable.path')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelK8sNode.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
