import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import { hitRate, siPrefix } from 'in-services/formatters/number';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function Neo4jSidebar({ snapshot }) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Neo4j</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

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
      />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
