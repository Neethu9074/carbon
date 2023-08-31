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
      <DescriptionItem title={t('in-forge:plugins.openTelemetry.hostName')}>
        {data.get('metrics.resource.hostname')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openTelemetry.remote')}>{data.get('remote')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openTelemetry.pid')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openTelemetry.containerPid')}>
        {data.get('metrics.resource.containerPid')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openTelemetry.containerId')}>
        {data.get('metrics.resource.container.id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openTelemetry.serviceName')}>
        {data.get('metrics.resource.service.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.openTelemetry.kind')}>{data.get('kind')}</DescriptionItem>
    </DescriptionList>
  );
}
