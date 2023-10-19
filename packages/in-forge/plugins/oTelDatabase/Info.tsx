/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function OpenTelemetryInfo({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.hostName')}>
        {data.get('resource.hostname')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.serviceName')}>
        {data.get('resource.service.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.oTelDatabase.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
