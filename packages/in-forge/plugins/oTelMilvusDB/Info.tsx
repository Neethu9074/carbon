/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function otelMilvusInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelMilvusDB.entityType')}>
        {data.get('resource.vectordb.entity.type')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelMilvusDB.serviceName')}>
        {data.get('resource.server.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelMilvusDB.instanceId')}>
        {data.get('resource.service.instance.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelMilvusDB.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
