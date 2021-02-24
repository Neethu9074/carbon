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

export default function ActiveMQArtemisInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.activeMQArtemis.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQArtemis.brokerName')}>
        {data.get('brokerName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQArtemis.nodeId')}>{data.get('nodeId')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.activeMQArtemis.ports')}>
        {data
          .get('ports', emptyList)
          .sort()
          .join(', ')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQArtemis.memoryLimit')}>
        {bytesTwoDecimalPlaces(data.get('memoryLimit'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQArtemis.addresses')}>
        {data.get('addressNames', emptyList).size}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.activeMQArtemis.queues')}>
        {data.get('queueNames', emptyList).size}
      </DescriptionItem>
    </DescriptionList>
  );
}
