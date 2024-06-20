/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsSns.topicName')}>{data.get('topicName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSns.arn')}>{data.get('topicArn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSns.region')}>{data.get('aws_region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSns.displayName')}>{data.get('display_name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSns.subscriptionsConfirmed')}>
        {data.get('subscriptions_confirmed')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSns.subscriptionsDeleted')}>
        {data.get('subscriptions_deleted')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSns.subscriptionsPending')}>
        {data.get('subscriptions_pending')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSns.numRetries')}>{data.get('num_retries')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSns.minDelayTarget')}>
        {data.get('min_delay_target')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsSns.maxDelayTarget')}>
        {data.get('max_delay_target')}
      </DescriptionItem>
    </DescriptionList>
  );
}
