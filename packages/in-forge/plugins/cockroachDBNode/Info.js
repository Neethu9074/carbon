/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import StatusLabel from './StatusLabel';

export default function CockroachDBInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Node ID">n{data.get('node_id')}</DescriptionItem>
      <DescriptionItem title="Cluster ID">{data.get('cluster_id')}</DescriptionItem>
      <DescriptionItem title="Version">{data.get('build_tag')}</DescriptionItem>
      <DescriptionItem title="Cache">{data.get('cache_size')}</DescriptionItem>
      {data.get('ready') != null && (
        <DescriptionItem title="Status">
          <StatusLabel status={data.get('ready')} insecure={data.get('insecure')} />
        </DescriptionItem>
      )}
    </DescriptionList>
  );
}
