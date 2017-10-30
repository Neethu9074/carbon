import React from 'react';

import { twoDecimalPlaces } from 'in-services/formatters/number';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';

import Info from '../Info';

export default function KubernetesClusterSidebar({ snapshot }) {
  const schedulerHealthy = snapshot.getIn(['data', 'componentStatuses', 'scheduler', 'Healthy'], 'False');
  const controllerMgrHealthy = snapshot.getIn(['data', 'componentStatuses', 'controller-manager', 'Healthy'], 'False');
  const etcdHealthy = snapshot.getIn(['data', 'componentStatuses', 'etcd-0', 'Healthy'], 'False');

  return (
    <div>
      <Separator />

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'pods.count',
            label: 'Pods',
            formatter: twoDecimalPlaces,
            aggregation: 'mean'
          }
        ]}
      />

      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Kubernetes Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible initiallyOpen>
        <Collapsible.Header>Component Statuses</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title="Scheduler">
              {schedulerHealthy === 'True' ? 'Healthy' : 'Not Healthy'}
            </DescriptionItem>
            <DescriptionItem title="Controller Manager">
              {controllerMgrHealthy === 'True' ? 'Healthy' : 'Not Healthy'}
            </DescriptionItem>
            <DescriptionItem title="etcd">{etcdHealthy === 'True' ? 'Healthy' : 'Not Healthy'}</DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
