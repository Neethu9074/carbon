/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleCacheClusterId')}>
        {data.get('cache_cluster_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleCacheNodeId')}>{data.get('node_id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleCacheEngine')}>{data.get('cache_engine')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleCacheEngineVersion')}>
        {data.get('cache_engine_version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleCacheNumberOfNodes')}>
        {data.get('cache_num_nodes')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleCacheNodeType')}>
        {data.get('cache_node_type')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleCreateTime')}>
        {formatDateTime(data.get('cache_cluster_create_time', ''))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleNodeEndpointAddress')}>
        {data.get('node_endpoint_address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleNodeEndpointPort')}>
        {data.get('node_endpoint_port')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleNodeARN')}>{data.get('node_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEc.titleGroupingZone')}>
        {data.get('aws_grouping_zone')}
      </DescriptionItem>
    </DescriptionList>
  );
}
