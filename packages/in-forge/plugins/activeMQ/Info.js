/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const role = data.get('slave') ? t('in-forge:plugins.activeMQ.slave') : t('in-forge:plugins.activeMQ.master');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.activeMQ.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQ.brokerName')}>{data.get('brokerName')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.activeMQ.healthStatus')}>{data.get('healthStatus')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQ.ports')}>
        {data
          .get('ports', emptyList)
          .sort()
          .join(', ')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQ.role')}>{role}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQ.memoryLimit')}>
        {bytesTwoDecimalPlaces(data.get('memoryLimit'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQ.storeLimit')}>
        {bytesTwoDecimalPlaces(data.get('storeLimit'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQ.topicsCount')}>
        {data.get('topicNames', emptyList).size}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQ.queuesCount')}>
        {data.get('queueNames', emptyList).size}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQ.dlQueuesCount')}>
        {data.get('dlqueueNames', emptyList).size}
      </DescriptionItem>
    </DescriptionList>
  );
}
