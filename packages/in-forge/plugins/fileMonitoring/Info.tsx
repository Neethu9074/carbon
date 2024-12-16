/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function FileMonitoringInfo({ snapshot }: { snapshot: SnapshotData }) {
  const snapshotId = snapshot.get('id');
  const details = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'monitors'), [snapshotId]);
  const data = snapshot.get('data');
  const monitors = details ? (details as SnapshotData).get('raw_payload') : [];
  const monitorSize = monitors?.size > 0 ? monitors.get('itemIds').size : 0;
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.fileMonitoring.numberOfMonitors')}>{monitorSize}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.fileMonitoring.host')}>{data.get('host')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.fileMonitoring.group')}>{data.get('group')}</DescriptionItem>
    </DescriptionList>
  );
}
