/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';
import Info from '../Info';

export default function SolrCloudClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.solrCloudCluster.solrCloudCluster')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'cluster.requests',
            label: t('in-forge:plugins.solrCloudCluster.averageRequests'),
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'cluster.evictions',
            label: t('in-forge:plugins.solrCloudCluster.evictions'),
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'cluster.errors',
            label: t('in-forge:plugins.solrCloudCluster.errors'),
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'cluster.docs_added',
            label: t('in-forge:plugins.solrCloudCluster.documentsAdded'),
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'cluster.timeouts',
            label: t('in-forge:plugins.solrCloudCluster.timeouts'),
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'cluster.docs_pending',
            label: t('in-forge:plugins.solrCloudCluster.documentsPending'),
            formatter: number,
            aggregation: 'sum'
          }
        ]}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
