/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function oTelDcgmInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelDcgm.entityType')}>
        {data.get('resource.dcgm.entity.type')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDcgm.address')}>
        {data.get('resource.server.address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDcgm.port')}>{data.get('resource.server.port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDcgm.serviceName')}>
        {data.get('resource.server.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDcgm.instanceId')}>
        {data.get('resource.service.instance.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDcgm.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
