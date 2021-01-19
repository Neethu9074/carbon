/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { getColorBySeverity } from 'in-stores/events';

export default function CockroachDBInfo({ snapshot }) {
  const red = getColorBySeverity(10);
  const yellow = getColorBySeverity(5);
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Cluster ID">{data.get('cluster_id')}</DescriptionItem>
      <DescriptionItem title="Live Nodes">{data.get('node_count')}</DescriptionItem>

      {data.get('suspect_node_count') != null && (
        <DescriptionItem title="Suspect Nodes">
          <span
            style={{
              color: data.get('suspect_node_count') > 0 ? yellow : 'inherit'
            }}
          >
            {data.get('suspect_node_count')}
          </span>
        </DescriptionItem>
      )}
      {data.get('dead_node_count') != null && (
        <DescriptionItem title="Dead Nodes">
          <span
            style={{
              color: data.get('dead_node_count') > 0 ? red : 'inherit'
            }}
          >
            {data.get('dead_node_count')}
          </span>
        </DescriptionItem>
      )}
    </DescriptionList>
  );
}
