/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import { siPrefix, bytes } from 'in-services/formatters/number';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from '../Info';

export default function ElasticsearchSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Elasticsearch</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'indices_count',
            label: 'Indices',
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'shards.node_active_shards',
            label: 'Active Shards',
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'indices.document_count',
            label: 'Documents',
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'indices.store_size',
            label: 'Store Size',
            formatter: bytes,
            aggregation: 'mean'
          }
        ]}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
