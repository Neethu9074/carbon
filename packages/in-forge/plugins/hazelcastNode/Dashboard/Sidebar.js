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
import { t } from 'in-i18n';
import Info from '../Info';

export default function HazelcastSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.hazelcastNode.dashboard.hazelcast')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'nodeMetrics.operationCount',
            label: t('in-forge:plugins.hazelcastNode.dashboard.operationCount'),
            formatter: siPrefix
          },
          {
            metric: 'nodeMetrics.migrationQueueSize',
            label: t('in-forge:plugins.hazelcastNode.dashboard.migrationQueueSize'),
            formatter: siPrefix
          },
          {
            metric: 'nodeMetrics.eventQueueSize',
            label: t('in-forge:plugins.hazelcastNode.dashboard.eventQueueSize'),
            formatter: siPrefix
          }
        ]}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
