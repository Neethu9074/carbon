/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';
import { get } from 'lodash';
import React from 'react';

import { Card } from '@instana/components';

import { LoadingSkeletonRows, Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import { percentageZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import getHostByKubernetesNode from 'in-subscription/kubernetes/getHostByKubernetesNode';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import EntityLink from 'in-components/EntityLink';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ nodeId, timeConfig }) => ({
    hostResult: getHostByKubernetesNode({
      filter: {
        nodeId,
        timeConfig
      }
    }).map(hostResult => {
      if (!hostResult || !hostResult.data) {
        return hostResult;
      }
      return {
        ...hostResult,
        data: fromJS(hostResult.data)
      };
    })
  }),
  function Infrastructure({ hostResult, timeConfig }) {
    const isLoading = hostResult && get(hostResult, ['progress', 'loading']);
    const hostIsUnmonitored = hostResult && hostResult.errors.length > 0;
    if (isLoading) {
      return (
        <Table>
          <Thead />
          <Tbody>
            <LoadingSkeletonRows cols={3} />
          </Tbody>
        </Table>
      );
    }

    if (hostIsUnmonitored) {
      return (
        <LeftRightPadding>
          <NoDataAvailable
            icon="lib_infrastructure"
            title={t('in-kubernetes:dashboards.unmonitoredHost')}
            text={t('in-kubernetes:dashboards.theHostIsUnmonitoredOnAKubernetesMasterNode')}
            height={140}
          />
        </LeftRightPadding>
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
                  snapshot={hostResult.data}
                  label={getLabel(hostResult.data)}
                  href$={getDashboardLink(hostResult.data.get('id'), {
                    pathname: '/physical/dashboard',
                    to: timeConfig.to,
                    focusedMoment: timeConfig.to
                  })}
                />
              </Td>
              <Td>
                <InfrastructureMetricSparkChart
                  snapshotId={hostResult.data.get('id')}
                  timeConfig={timeConfig}
                  formatter={percentageZeroDecimalPlaces}
                  tooltipFormatter={percentageTwoDecimalPlaces}
                  metric="cpu.used"
                  renderPostChartContent={K8DashboardsMarkerLanes}
                />
              </Td>
              <Td>
                <InfrastructureMetricSparkChart
                  snapshotId={hostResult.data.get('id')}
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
