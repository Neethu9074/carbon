/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Info from '../Info';

function componentStatusToText(healthy) {
  if (healthy === undefined || healthy === null) {
    return null;
  }
  return healthy === 'True' ? 'Healthy' : 'Not Healthy';
}

export default function KubernetesClusterSidebar({ snapshot }) {
  const schedulerHealthy = snapshot.getIn(['data', 'componentStatuses', 'scheduler', 'Healthy']);
  const controllerMgrHealthy = snapshot.getIn(['data', 'componentStatuses', 'controller-manager', 'Healthy']);
  const etcdHealthy = snapshot.getIn(['data', 'componentStatuses', 'etcd-0', 'Healthy']);
  const isOpenshift = snapshot.getIn(['data', 'isOpenshift'], false);
  return (
    <div>
      <Columize>
        <SparkChartsSection
          snapshot={snapshot}
          metrics={[
            {
              metric: 'nodes.count',
              label: 'Nodes',
              formatter: number,
              aggregation: 'mean'
            }
          ]}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <SparkChartsSection
          snapshot={snapshot}
          metrics={[
            {
              metric: 'pods.count',
              label: 'Pods',
              formatter: number,
              aggregation: 'mean'
            }
          ]}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>

      <Collapsible initiallyOpen>
        <Collapsible.Header>Kubernetes Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {!isOpenshift && (
        <Collapsible initiallyOpen>
          <Collapsible.Header>Component Status</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title="Scheduler">{componentStatusToText(schedulerHealthy)}</DescriptionItem>
              <DescriptionItem title="Controller Manager">
                {componentStatusToText(controllerMgrHealthy)}
              </DescriptionItem>
              <DescriptionItem title="etcd">{componentStatusToText(etcdHealthy)}</DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}
    </div>
  );
}
