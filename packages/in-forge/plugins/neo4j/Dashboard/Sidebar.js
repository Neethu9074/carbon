/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import { hitRate, siPrefix } from 'in-services/formatters/number';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from '../Info';

export default function Neo4jSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Neo4j</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'primitiveCount.nodeIds',
            label: 'Node IDs',
            formatter: siPrefix
          },
          {
            metric: 'primitiveCount.propertyIds',
            label: 'Property IDs',
            formatter: siPrefix
          },
          {
            metric: 'primitiveCount.relationshipIds',
            label: 'Relationship IDs',
            formatter: siPrefix
          },
          {
            metric: 'primitiveCount.relationShipTypeIds',
            label: 'Relationship Type IDs',
            formatter: siPrefix
          },
          {
            metric: 'pageCache.usageRatio',
            label: 'Usage Ratio',
            formatter: hitRate
          },
          {
            metric: 'pageCache.hitRatio',
            label: 'Hit Ratio',
            formatter: hitRate
          }
        ]}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
