/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { siPrefix } from 'in-services/formatters/number';
import Info from '../Info';

export default function HazelcastSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Hazelcast</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'nodeMetrics.operationCount',
            label: 'Operation Count',
            formatter: siPrefix
          },
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
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
