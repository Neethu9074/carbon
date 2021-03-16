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
import { t } from 'in-i18n';
import Info from '../Info';

export default function ElasticsearchSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.elasticsearchNode.dashboard.elasticsearch')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'indices_count',
            label: t('in-forge:plugins.elasticsearchNode.dashboard.indices'),
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'shards.node_active_shards',
            label: t('in-forge:plugins.elasticsearchNode.dashboard.activeShards'),
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'indices.document_count',
            label: t('in-forge:plugins.elasticsearchNode.dashboard.documents'),
            formatter: siPrefix,
            aggregation: 'mean'
          },
          {
            metric: 'indices.store_size',
            label: t('in-forge:plugins.elasticsearchNode.dashboard.storeSize'),
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
