/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const bytesTwoDecimalPlacesPositiveFormatter = d => (d > 0 ? bytesTwoDecimalPlaces(d) : '-');

export default function RedisInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseNode.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseNode.version')}>{data.get('version')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseNode.address')}>{data.get('addr')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseNode.status')}>{data.get('status')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseNode.operatingSystem')}>
        {data.get('osName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseNode.shardCount')}>
        {data.get('shardCount')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseNode.cores')}>{data.get('cores')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseNode.totalMemory')}>
        {bytesTwoDecimalPlacesPositiveFormatter(data.get('totalMemory'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseNode.clusterName')}>
        {data.get('clusterName')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
