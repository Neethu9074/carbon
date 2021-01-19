/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function ClickHouseInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Process ID">{data.get('pid')}</DescriptionItem>
      <DescriptionItem title="Host">{data.get('host')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('version')}</DescriptionItem>
      <DescriptionItem title="Cluster">{data.get('cluster.name')}</DescriptionItem>
      <DescriptionItem title="Shard">{data.get('shard_num')}</DescriptionItem>
      <DescriptionItem title="Shard Weight">{data.get('shard_weight')}</DescriptionItem>
      <DescriptionItem title="Replica">{data.get('replica_num')}</DescriptionItem>
      <DescriptionItem title="HTTP Port">{data.get('http_port')}</DescriptionItem>
      <DescriptionItem title="TCP Port">{data.get('tcp_port')}</DescriptionItem>
      <DescriptionItem title="Server Log">{data.get('log')}</DescriptionItem>
      <DescriptionItem title="Error Log">{data.get('errorlog')}</DescriptionItem>
    </DescriptionList>
  );
}
