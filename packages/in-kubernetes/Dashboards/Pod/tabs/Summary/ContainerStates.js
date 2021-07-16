/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { Td, Table, Thead, Tbody, Tr, Th } from '@instana/components';
import { Link } from '@instana/components';

import {
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import getKubernetesContainers from 'in-subscription/kubernetes/getKubernetesContainers';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import PodMessage from 'in-kubernetes/Dashboards/commonComponents/PodMessage';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import ViewAllWrapper from 'in-components/TopListCard/ViewAllWrapper';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { getContainerIconByPlugin } from 'in-kubernetes/icons';
import Capitalize from 'in-components/Capitalize';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './ContainerStates.mless';

export default connectTo(
  ({ pod, timeConfig }) => ({ snapshotEnrichedContainerStates: getSnapshotEnrichedContainerStates(pod, timeConfig) }),
  function ContainerStates({ pod, snapshotEnrichedContainerStates = {}, timeConfig }) {
    const containerStatuses = get(pod, ['status', 'containerStatuses'], []);
    const allContainerStates = [...get(pod, ['status', 'initContainerStatuses'], []), ...containerStatuses];
    if (!allContainerStates || allContainerStates.length === 0) {
      return <NoDataAvailable height={160} />;
    }

    const maxPresentedStates = 5;
    const presentedStates = allContainerStates.slice(0, maxPresentedStates);

    return (
      <Fragment>
        <Table>
          <Thead>
            <Tr size="compact">
              <Th>{t('in-kubernetes:dashboards.name')}</Th>
              <Th>{t('in-kubernetes:dashboards.ready')}</Th>
              <Th>{t('in-kubernetes:dashboards.status')}</Th>
              <Th>{t('in-kubernetes:dashboards.message')}</Th>
              <Th>{t('in-kubernetes:dashboards.cpuTotalPercentage')}</Th>
              <Th>{t('in-kubernetes:dashboards.memoryUsage')}</Th>
              <Th>{t('in-kubernetes:dashboards.health')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {presentedStates.map((status, i) => {
              if (get(snapshotEnrichedContainerStates, [status.containerSnapshotId, 'snapshot'])) {
                const containerSnapshot = snapshotEnrichedContainerStates[status.containerSnapshotId].snapshot;

                return (
                  <Tr key={i}>
                    <Td className={locals.labelColumn}>
                      <SeverityAwareEntityLink
                        icon={getContainerIconByPlugin(get(containerSnapshot, ['container', 'plugin']))}
                        label={get(containerSnapshot, ['containerLabel'])}
                        href$={getDashboardLink(status.containerSnapshotId, {
                          pathname: '/physical/dashboard',
                          to: timeConfig.to,
                          focusedMoment: timeConfig.to
                        })}
                        severity={get(containerSnapshot, ['entityHealthInfo', 'maxSeverity'])}
                      />
                    </Td>
                    <Td>{status.ready ? t('in-kubernetes:dashboards.yes') : t('in-kubernetes:dashboards.no')}</Td>
                    <Td>
                      <Capitalize>{status.state.status}</Capitalize>
                    </Td>
                    <Td>
                      <PodMessage message={status.message} />
                    </Td>
                    <Td>
                      {status.containerSnapshotId && (
                        <InfrastructureMetricSparkChart
                          snapshotId={status.containerSnapshotId}
                          timeConfig={timeConfig}
                          formatter={percentageZeroDecimalPlaces}
                          tooltipFormatter={percentageTwoDecimalPlaces}
                          metric="cpu.total_usage"
                          renderPostChartContent={K8DashboardsMarkerLanes}
                        />
                      )}
                    </Td>
                    <Td>
                      {status.containerSnapshotId && (
                        <InfrastructureMetricSparkChart
                          snapshotId={status.containerSnapshotId}
                          timeConfig={timeConfig}
                          formatter={bytesZeroDecimalPlaces}
                          tooltipFormatter={bytesTwoDecimalPlaces}
                          metric="memory.usage"
                          renderPostChartContent={K8DashboardsMarkerLanes}
                        />
                      )}
                    </Td>
                    <Td>
                      <EntityHealthIndicator
                        openIssues={get(containerSnapshot, ['entityHealthInfo', 'openIssues', 'length'])}
                        maxSeverity={get(containerSnapshot, ['entityHealthInfo', 'maxSeverity'])}
                        IndicatorPresenter={HealthIndicatorPresenter}
                        timeConfig={timeConfig}
                        snapshotId={status.containerSnapshotId}
                      />
                    </Td>
                  </Tr>
                );
              }
              return (
                <Tr key={i}>
                  <Td className={locals.labelColumn}>{status.name}</Td>
                  <Td>{status.ready ? t('in-kubernetes:dashboards.yes') : t('in-kubernetes:dashboards.no')}</Td>
                  <Td>
                    <Capitalize>{status.state.status}</Capitalize>
                  </Td>
                  <Td>
                    <PodMessage message={status.message} />
                  </Td>
                  <Td>
                    {status.containerSnapshotId && (
                      <InfrastructureMetricSparkChart
                        snapshotId={status.containerSnapshotId}
                        timeConfig={timeConfig}
                        formatter={percentageZeroDecimalPlaces}
                        tooltipFormatter={percentageTwoDecimalPlaces}
                        metric="cpu.total_usage"
                        renderPostChartContent={K8DashboardsMarkerLanes}
                      />
                    )}
                  </Td>
                  <Td>
                    {status.containerSnapshotId && (
                      <InfrastructureMetricSparkChart
                        snapshotId={status.containerSnapshotId}
                        timeConfig={timeConfig}
                        formatter={bytesZeroDecimalPlaces}
                        tooltipFormatter={bytesTwoDecimalPlaces}
                        metric="memory.usage"
                        renderPostChartContent={K8DashboardsMarkerLanes}
                      />
                    )}
                  </Td>
                  <Td>&mdash;</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <div className={locals.viewAllWrapper}>
          <ViewAllWrapper
            ViewAll={ViewAll}
            viewAllHref$={getPodDashboard(pod.id, { tab: '/containers' })}
            presentedStates={presentedStates}
            className={locals.viewAllLink}
          />
        </div>
      </Fragment>
    );
  }
);

function ViewAll({ viewAllHref$, presentedStates, className }) {
  return (
    <Link className={className} href$={viewAllHref$}>
      {presentedStates.length > 1
        ? t('in-kubernetes:dashboards.viewAllContainers', { count: presentedStates.length })
        : t('in-kubernetes:dashboards.viewAllContainers')}
    </Link>
  );
}

function getSnapshotEnrichedContainerStates(pod, timeConfig) {
  return getKubernetesContainers({
    pagination: {
      page: 1,
      pageSize: 200 // we need all containers available. It's very unlikely that there will be more than 3-4 anyways. 200 is the max allowed value
    },
    order: {
      by: 'label',
      direction: 'ASC'
    },
    filter: {
      label: '',
      podId: pod.id,
      timeConfig
    }
  })
    .filter(containersResult => containersResult && containersResult.data)
    .map(containersResult => {
      const containers = containersResult.data.items;
      const allContainerStatuses = [
        ...get(pod, ['status', 'initContainerStatuses'], []),
        ...get(pod, ['status', 'containerStatuses'], [])
      ];
      const snapshotEnrichedStates = {};
      for (let i = 0; i < allContainerStatuses.length; i++) {
        const state = allContainerStatuses[i];
        snapshotEnrichedStates[state.containerSnapshotId] = {
          state,
          snapshot: findSnapshotById(state.containerSnapshotId, containers)
        };
      }
      return snapshotEnrichedStates;
    });
}

function findSnapshotById(id, snapshots) {
  for (let i = 0; i < snapshots.length; i++) {
    if (snapshots[i].container.id === id) {
      return snapshots[i];
    }
  }
}
