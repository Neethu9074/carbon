/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/redisCluster/Info.js';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function RedisClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Redis Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'cluster_known_nodes',
            label: t('in-forge:plugins.redisCluster.nodes'),
            formatter: number.compact,
            aggregation: 'max'
          },
          {
            metric: 'cluster_size',
            label: t('in-forge:plugins.redisCluster.masterNodes'),
            formatter: number.compact,
            aggregation: 'max'
          }
        ]}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
