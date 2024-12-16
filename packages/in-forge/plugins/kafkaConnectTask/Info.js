/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { t } from 'in-i18n';

export default function KafkaConnectTaskInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.kafkaConnectTask.taskId')}>{data.get('taskId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafkaConnectTask.connectorId')}>
        {data.get('connectorId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafkaConnectTask.status')}>{data.get('status')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
