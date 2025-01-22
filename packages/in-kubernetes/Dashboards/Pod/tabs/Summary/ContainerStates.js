/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { Link, DataTable as CarbonDataTable } from '@instana/components';

import {
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import getKubernetesContainers from 'in-kubernetes/subscriptions/getKubernetesContainers';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import PodMessage from 'in-kubernetes/Dashboards/commonComponents/PodMessage';
import ViewAllWrapper from 'in-components/TopListCard/ViewAllWrapper';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { usePodDashboard } from 'in-kubernetes/navigation/paths';
import { getContainerIconByPlugin } from 'in-kubernetes/utils';
import Capitalize from 'in-components/Capitalize';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './ContainerStates.mless';

export default connectTo(
  ({ pod, timeConfig }) => ({ snapshotEnrichedContainerStates: getSnapshotEnrichedContainerStates(pod, timeConfig) }),
  function ContainerStates({ pod, snapshotEnrichedContainerStates = {}, timeConfig }) {
    const containerStatuses = get(pod, ['status', 'containerStatuses'], []);
    const allContainerStates = [...get(pod, ['status', 'initContainerStatuses'], []), ...containerStatuses];
    const viewAllHref = usePodDashboard(pod.id, { tab: '/containers' });
    const getDashboardLink = useGetDashboardLink();

    if (!allContainerStates || allContainerStates.length === 0) {
      return <NoDataAvailable height={160} />;
    }

    const maxPresentedStates = 5;
    const presentedStates = allContainerStates.slice(0, maxPresentedStates);
    const carbonHeaders = [
      {
        key: 'name',
        header: t('in-kubernetes:dashboards.name')
      },
      {
        key: 'ready',
        header: t('in-kubernetes:dashboards.ready')
      },
      {
        key: 'status',
        header: t('in-kubernetes:dashboards.status')
      },
      {
        key: 'message',
        header: t('in-kubernetes:dashboards.message')
      },
      {
        key: 'cpuTotalPercentage',
        header: t('in-kubernetes:dashboards.cpuTotalPercentage')
      },
      {
        key: 'memoryUsage',
        header: t('in-kubernetes:dashboards.memoryUsage')
      },
      {
        key: 'health',
        header: t('in-kubernetes:dashboards.health')
      }
    ];
    const carbonRows = presentedStates.map((status, i) => {
      const containerSnapshot = snapshotEnrichedContainerStates[status.containerSnapshotId]?.snapshot;
      if (get(snapshotEnrichedContainerStates, [status?.containerSnapshotId, 'snapshot'])) {
        return {
          id: `${i}`,
          ['name']: (
            <div className={locals.labelColumn}>
              <SeverityAwareEntityLink
                icon={getContainerIconByPlugin(get(containerSnapshot, ['container', 'plugin']))}
                label={get(containerSnapshot, ['containerLabel'])}
                href={getDashboardLink(status.containerSnapshotId, {
                  pathname: '/physical/dashboard',
                  to: timeConfig.to,
                  focusedMoment: timeConfig.to
                })}
                severity={get(containerSnapshot, ['entityHealthInfo', 'maxSeverity'])}
              />
            </div>
          ),
          ['ready']: status.ready ? t('in-kubernetes:dashboards.yes') : t('in-kubernetes:dashboards.no'),
          ['status']: <Capitalize>{status.state.status}</Capitalize>,
          ['message']: <PodMessage message={status.message} />,
          ['cpuTotalPercentage']: status.containerSnapshotId && (
            <InfrastructureMetricSparkChart
              snapshotId={status.containerSnapshotId}
              timeConfig={timeConfig}
              formatter={percentageZeroDecimalPlaces}
              tooltipFormatter={percentageTwoDecimalPlaces}
              metric="cpu.total_usage"
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          ),
          ['memoryUsage']: status.containerSnapshotId && (
            <InfrastructureMetricSparkChart
              snapshotId={status.containerSnapshotId}
              timeConfig={timeConfig}
              formatter={bytesZeroDecimalPlaces}
              tooltipFormatter={bytesTwoDecimalPlaces}
              metric="memory.usage"
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          ),
          ['health']: (
            <EntityHealthIndicator
              openIssues={get(containerSnapshot, ['entityHealthInfo', 'openIssues', 'length'])}
              maxSeverity={get(containerSnapshot, ['entityHealthInfo', 'maxSeverity'])}
              IndicatorPresenter={HealthIndicatorPresenter}
              timeConfig={timeConfig}
              snapshotId={status.containerSnapshotId}
            />
          )
        };
      }
      return {
        id: String(i),
        ['name']: status.name,
        ['ready']: status.ready ? t('in-kubernetes:dashboards.yes') : t('in-kubernetes:dashboards.no'),
        ['status']: <Capitalize>{status.state.status}</Capitalize>,
        ['message']: <PodMessage message={status.message} />,
        ['cpuTotalPercentage']: status?.containerSnapshotId && (
          <InfrastructureMetricSparkChart
            snapshotId={status?.containerSnapshotId}
            timeConfig={timeConfig}
            formatter={percentageZeroDecimalPlaces}
            tooltipFormatter={percentageTwoDecimalPlaces}
            metric="cpu.total_usage"
            renderPostChartContent={K8DashboardsMarkerLanes}
          />
        ),
        ['memoryUsage']: status?.containerSnapshotId && (
          <InfrastructureMetricSparkChart
            snapshotId={status?.containerSnapshotId}
            timeConfig={timeConfig}
            formatter={bytesZeroDecimalPlaces}
            tooltipFormatter={bytesTwoDecimalPlaces}
            metric="memory.usage"
            renderPostChartContent={K8DashboardsMarkerLanes}
          />
        ),
        ['health']: <>&mdash;</>
      };
    });

    return (
      <>
        <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
        <div className={locals.viewAllWrapper}>
          <ViewAllWrapper
            ViewAll={ViewAll}
            viewAllHref={viewAllHref}
            presentedStates={presentedStates}
            className={locals.viewAllLink}
          />
        </div>
      </>
    );
  }
);

function ViewAll({ viewAllHref, presentedStates, className }) {
  return (
    <Link className={className} href={viewAllHref}>
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
