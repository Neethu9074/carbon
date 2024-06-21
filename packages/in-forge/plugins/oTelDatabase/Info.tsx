/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

// @ts-expect-error needs typescript migration
import ParentOTelDatabase from 'in-forge/plugins/oTelDatabase/ParentOTelDatabase';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function OpenTelemetryInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.entityType')}>
        {data.get('resource.db.entity.type')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.databaseSystem')}>
        {data.get('resource.db.system')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.serviceName')}>
        {data.get('resource.service.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.address')}>
        {data.get('resource.server.address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.name')}>{data.get('resource.db.name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.version')}>
        {data.get('resource.db.version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.instanceId')}>
        {data.get('resource.service.instance.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.port')}>
        {data.get('resource.server.port')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.kind')}>{data.get('kind')}</DescriptionItem>
      <ParentOTelDatabase snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
