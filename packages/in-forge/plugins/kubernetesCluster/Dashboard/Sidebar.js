/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';
import Info from '../Info';

function componentStatusToText(healthy) {
  if (healthy === undefined || healthy === null) {
    return null;
  }
  return healthy === 'True'
    ? t('in-forge:plugins.kubernetesCluster.healthy')
    : t('in-forge:plugins.kubernetesCluster.notHealthy');
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
              label: t('in-forge:plugins.kubernetesCluster.nodes'),
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
              label: t('in-forge:plugins.kubernetesCluster.pods'),
              formatter: number,
              aggregation: 'mean'
            }
          ]}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>

      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.kubernetesCluster.kubernetesCluster')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {!isOpenshift && (
        <Collapsible initiallyOpen>
          <Collapsible.Header>{t('in-forge:plugins.kubernetesCluster.componentStatus')}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title={t('in-forge:plugins.kubernetesCluster.scheduler')}>
                {componentStatusToText(schedulerHealthy)}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.kubernetesCluster.controllerManager')}>
                {componentStatusToText(controllerMgrHealthy)}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.kubernetesCluster.etcd')}>
                {componentStatusToText(etcdHealthy)}
              </DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}
    </div>
  );
}
