import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { siPrefix } from 'in-services/formatters/number';

import Info from '../Info';

export default function HazelcastSidebar({ snapshot }) {
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Hazelcast</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'nodeMetrics.migrationQueueSize',
            label: 'MigrationQueue Size',
            formatter: siPrefix
          },
          {
            metric: 'nodeMetrics.eventQueueSize',
            label: 'EventQueue Size',
            formatter: siPrefix
          }
        ]}
      />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
