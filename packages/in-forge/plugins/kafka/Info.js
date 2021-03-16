/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function KafkaInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.kafka.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafka.zookeeperConnect')}>
        {data.get('config.zookeeper')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafka.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafka.nodeId')}>{data.get('node_id')}</DescriptionItem>
    </DescriptionList>
  );
}
