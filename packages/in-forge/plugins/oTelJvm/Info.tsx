/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function OTelJvmInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelJvm.entityType')}>
        {data.get('resource.jvm.entity.type')}
      </DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.oTelJvm.platform')}>
        {data.get('resource.jvm.platform')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelJvm.address')}>
        {data.get('resource.server.address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelJvm.port')}>{data.get('resource.server.port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelJvm.serviceName')}>
        {data.get('resource.server.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelJvm.instanceId')}>
        {data.get('resource.service.instance.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelJvm.runtimeVersion')}>
        {data.get('resource.process.runtime.version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelJvm.runtimeDesc')}>
        {data.get('resource.process.runtime.description')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelJvm.exePath')}>
        {data.get('resource.process.executable.path')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelJvm.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
