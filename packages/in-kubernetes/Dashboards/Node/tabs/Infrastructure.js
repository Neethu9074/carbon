/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { TableLoadingSkeletonRows, Table, Thead, Tbody, Tr, Th, Td } from '@instana/legacy';
import { Card, DataTable as CarbonDataTable } from '@instana/components';

import { percentageZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import getHostByKubernetesNodeId from 'in-kubernetes/Dashboards/utils/getHostByKubernetesNodeId';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { carbonTableEnabled } from 'in-services/featureFlags';
import EntityLink from 'in-components/EntityLink';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ nodeId, timeConfig }) => ({
    host: getHostByKubernetesNodeId({ nodeId, timeConfig })
  }),
  function Infrastructure({ host, timeConfig, data: { labels } }) {
    const isLoading = host && get(host, ['progress', 'loading']);
    const isHostUnmonitored = host && host.errors.length > 0;
    const isEksNode = labels.find(item => item.key === 'eks.amazonaws.com/compute-type' && item.value === 'fargate');
    const getDashboardLink = useGetDashboardLink();

    if (isLoading) {
      return (
        <Table>
          <Thead />
          <Tbody>
            <TableLoadingSkeletonRows cols={3} />
          </Tbody>
        </Table>
      );
    }

    if (isHostUnmonitored) {
      return (
        <LeftRightPadding>
          <NoDataAvailable
            icon="lib_infrastructure"
            title={t('in-kubernetes:dashboards.unmonitoredHost')}
            text={
              isEksNode
                ? t('in-kubernetes:dashboards.theHostIsUnmonitoredFargateNode')
                : t('in-kubernetes:dashboards.theHostIsUnmonitoredOnAKubernetesMasterNode')
            }
            height={140}
          />
        </LeftRightPadding>
      );
    }

    if (carbonTableEnabled) {
      const carbonHeaders = [
        {
          key: 'name',
          header: t('in-kubernetes:dashboards.name')
        },
        {
          key: 'cpuUsage',
          header: t('in-kubernetes:dashboards.cpuUsage')
        },
        {
          key: 'memoryUsage',
          header: t('in-kubernetes:dashboards.memoryUsage')
        }
      ];

      const carbonRows = [
        {
          id: '1',
          ['name']: (
            <EntityLink
              snapshot={host.data}
              label={getLabel(host.data)}
              href={getDashboardLink(host.data.get('id'), {
                pathname: '/physical/dashboard',
                to: timeConfig.to,
                focusedMoment: timeConfig.to
              })}
            />
          ),
          ['cpuUsage']: (
            <InfrastructureMetricSparkChart
              snapshotId={host.data.get('id')}
              timeConfig={timeConfig}
              formatter={percentageZeroDecimalPlaces}
              tooltipFormatter={percentageTwoDecimalPlaces}
              metric="cpu.used"
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          ),
          ['memoryUsage']: (
            <InfrastructureMetricSparkChart
              snapshotId={host.data.get('id')}
              timeConfig={timeConfig}
              formatter={percentageZeroDecimalPlaces}
              tooltipFormatter={percentageTwoDecimalPlaces}
              metric="memory.used"
              renderPostChartContent={K8DashboardsMarkerLanes}
            />
          )
        }
      ];

      return (
        <Card title={t('in-kubernetes:dashboards.host')} withoutPadding disableLayer>
          <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
        </Card>
      );
    }

    return (
      <Card title={t('in-kubernetes:dashboards.host')} withoutPadding>
        <Table>
          <Thead>
            <Tr size="compact">
              <Th>{t('in-kubernetes:dashboards.name')}</Th>
              <Th>{t('in-kubernetes:dashboards.cpuUsage')}</Th>
              <Th>{t('in-kubernetes:dashboards.memoryUsage')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <EntityLink
                  snapshot={host.data}
                  label={getLabel(host.data)}
                  href={getDashboardLink(host.data.get('id'), {
                    pathname: '/physical/dashboard',
                    to: timeConfig.to,
                    focusedMoment: timeConfig.to
                  })}
                />
              </Td>
              <Td>
                <InfrastructureMetricSparkChart
                  snapshotId={host.data.get('id')}
                  timeConfig={timeConfig}
                  formatter={percentageZeroDecimalPlaces}
                  tooltipFormatter={percentageTwoDecimalPlaces}
                  metric="cpu.used"
                  renderPostChartContent={K8DashboardsMarkerLanes}
                />
              </Td>
              <Td>
                <InfrastructureMetricSparkChart
                  snapshotId={host.data.get('id')}
                  timeConfig={timeConfig}
                  formatter={percentageZeroDecimalPlaces}
                  tooltipFormatter={percentageTwoDecimalPlaces}
                  metric="memory.used"
                  renderPostChartContent={K8DashboardsMarkerLanes}
                />
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Card>
    );
  }
);
