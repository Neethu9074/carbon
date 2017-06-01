import React from 'react';

import { siPrefix, bytes } from 'in-services/formatters/number';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function ElasticsearchSidebar({ snapshot }) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Elasticsearch</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'indices_count',
            label: 'Indices',
            formatter: siPrefix
          },
          {
            metric: 'shards.node_active_shards',
            label: 'Active Shards',
            formatter: siPrefix
          },
          {
            metric: 'indices.document_count',
            label: 'Documents',
            formatter: siPrefix
          },
          {
            metric: 'indices.store_size',
            label: 'Store Size',
            formatter: bytes
          }
        ]}
      />

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
