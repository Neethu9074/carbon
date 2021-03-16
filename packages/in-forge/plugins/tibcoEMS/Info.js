/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { positiveNumber } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.version')}>{data.get('version')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.infoTitle.ports')}>
        {data
          .get('ports', emptyList)
          .sort()
          .join(', ')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.state')}>{data.get('state')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.maxConnections')}>
        {positiveNumber(data.get('maxConnections'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.topics')}>
        {data.get('topicNames', emptyList).size}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.queues')}>
        {data.get('queueNames', emptyList).size}
      </DescriptionItem>
    </DescriptionList>
  );
}
