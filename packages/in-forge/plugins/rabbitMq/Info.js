/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function RabbitMqInfo({ snapshot }) {
  const data = snapshot.get('data');
  const nodeNames = data.get('nodes', emptyList);
  const channelNames = data.get('channels', emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.rabbitMq.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rabbitMq.ports')}>
        {data.get('overview.ports', emptyList).join(', ')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rabbitMq.version')}>{data.get('overview.version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rabbitMq.erlangVersion')}>
        {data.get('overview.erlang_version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rabbitMq.node')}>{data.get('overview.node')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rabbitMq.nodes')}>{nodeNames.size}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.rabbitMq.channels')}>{channelNames.size}</DescriptionItem>
    </DescriptionList>
  );
}
