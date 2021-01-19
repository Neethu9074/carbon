/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Cache Cluster Id">{data.get('cache_cluster_id')}</DescriptionItem>
      <DescriptionItem title="Cache Node Id">{data.get('node_id')}</DescriptionItem>
      <DescriptionItem title="Cache Engine">{data.get('cache_engine')}</DescriptionItem>
      <DescriptionItem title="Cache Engine Version">{data.get('cache_engine_version')}</DescriptionItem>
      <DescriptionItem title="Cache Number Of Nodes">{data.get('cache_num_nodes')}</DescriptionItem>
      <DescriptionItem title="Cache Node Type">{data.get('cache_node_type')}</DescriptionItem>
      <DescriptionItem title="Create Time">{formatDateTime(data.get('cache_cluster_create_time', ''))}</DescriptionItem>
      <DescriptionItem title="Node Endpoint Address">{data.get('node_endpoint_address')}</DescriptionItem>
      <DescriptionItem title="Node Endpoint Port">{data.get('node_endpoint_port')}</DescriptionItem>
      <DescriptionItem title="Node ARN">{data.get('node_arn')}</DescriptionItem>
      <DescriptionItem title="Grouping Zone">{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
