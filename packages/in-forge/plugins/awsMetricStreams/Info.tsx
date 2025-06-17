/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');
  return (
    <>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.awsMetricStreams.infoTitle.arn')}>
          {data.get('arn')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsMetricStreams.infoTitle.namespace')}>
          {data.get('namespace')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsMetricStreams.infoTitle.region')}>
          {data.get('cloud.region')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsMetricStreams.infoTitle.accountId')}>
          {data.get('cloud.account.id')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsMetricStreams.infoTitle.exporterArn')}>
          {data.get('aws.exporter.arn')}
        </DescriptionItem>
      </DescriptionList>
    </>
  );
}
