import { fromJS } from 'immutable';
import { get } from 'lodash';
import React from 'react';

import { LoadingSkeletonRows, Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import { percentageZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import getHostByKubernetesNode from 'in-subscription/kubernetes/getHostByKubernetesNode';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import EntityLink from 'in-new-components/EntityLink';
import { getLabel } from 'in-sdk/snapshot';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

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
        <MaxWidthFullscreenContainer>
          <NoDataAvailable
            icon="lib_infrastructure"
            title="Unmonitored Host"
            text="The host is unmonitored on a Kubernetes master node"
            height={140}
          />
        </MaxWidthFullscreenContainer>
      );
    }

    return (
      <Card title="Host" withoutPadding>
        <Table>
          <Thead>
            <Tr size="compact">
              <Th>Name</Th>
              <Th>CPU Usage</Th>
              <Th>Memory Usage</Th>
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
                />
              </Td>
              <Td>
                <InfrastructureMetricSparkChart
                  snapshotId={hostResult.data.get('id')}
                  timeConfig={timeConfig}
                  formatter={percentageZeroDecimalPlaces}
                  tooltipFormatter={percentageTwoDecimalPlaces}
                  metric="memory.used"
                />
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Card>
    );
  }
);
