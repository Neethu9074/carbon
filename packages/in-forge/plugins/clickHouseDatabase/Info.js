/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function ClickHouseInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoProcessID')}>
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoHost')}>{data.get('host')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoVersion')}>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoCluster')}>
        {data.get('cluster.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoShard')}>
        {data.get('shard_num')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoShardWeight')}>
        {data.get('shard_weight')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoReplica')}>
        {data.get('replica_num')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoHTTPPort')}>
        {data.get('http_port')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoTCPPort')}>
        {data.get('tcp_port')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoServerLog')}>
        {data.get('log')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.infoErrorLog')}>
        {data.get('errorlog')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.clickhouseDatabase.maxConcurrentQueries')}>
        {data.get('max_concurrent_queries')}
      </DescriptionItem>
    </DescriptionList>
  );
}
