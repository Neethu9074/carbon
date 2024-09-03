/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot/';
import { t } from 'in-i18n';

export default function FileMonitoringInfo({ snapshot }: { snapshot: SnapshotData }) {
  const snapshotId = snapshot.get('id');
  const details = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'conditions'), [snapshotId]);
  const data = snapshot.get('data');
  const conditions = details ? (details as SnapshotData).get('raw_payload') : [];

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.fileMonitoringCondition.numberOfConditions')}>
        {conditions.size}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.fileMonitoringCondition.path')}>{data.get('path')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.fileMonitoringCondition.interval')}>
        {data.get('interval')}
      </DescriptionItem>
    </DescriptionList>
  );
}
