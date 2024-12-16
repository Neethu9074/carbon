/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.rocketMqCluster.clusterName')}>
        {data.get('clusterName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rocketMqBroker.brokerName')}>
        {data.get('brokerName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rocketMqBroker.brokerId')}>{data.get('brokerId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rocketMqBroker.brokerAddr')}>
        {data.get('brokerAddr')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rocketMqBroker.bootTimestamp')}>
        {data.get('bootTimestamp')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rocketMqBroker.runtime')}>{data.get('runtime')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rocketMqBroker.brokerVersionDesc')}>
        {data.get('brokerVersionDesc')}
      </DescriptionItem>
    </DescriptionList>
  );
}
