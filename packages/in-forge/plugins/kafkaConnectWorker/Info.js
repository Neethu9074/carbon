/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function KafkaConnectWorkerInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.kafkaConnectWorker.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafkaConnectWorker.workerName')}>
        {data.get('workerId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafkaConnectWorker.brokersInUse')}>
        {data.get('numberOfBrokers')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
