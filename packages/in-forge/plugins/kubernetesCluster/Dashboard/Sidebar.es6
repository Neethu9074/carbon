import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
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

  return (
    <div>
      <Separator />
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
        />
      </Columize>

      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Kubernetes Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Component Statuses</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Scheduler">{componentStatusToText(schedulerHealthy)}</DescriptionItem>
            <DescriptionItem title="Controller Manager">{componentStatusToText(controllerMgrHealthy)}</DescriptionItem>
            <DescriptionItem title="etcd">{componentStatusToText(etcdHealthy)}</DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
