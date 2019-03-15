import React, { Fragment } from 'react';

import {
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import { Td, Table, Thead, Tbody, Tr, Th } from 'in-components/tables/sharedComponents';
import PodMessage from 'in-kubernetes/Dashboards/commonComponents/PodMessage';
import Capitalize from 'in-kubernetes/Dashboards/commonComponents/Capitalize';
import ReadyIcon from 'in-kubernetes/Dashboards/commonComponents/ReadyIcon';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import Link from 'in-components/Link';

import locals from './ContainerStates.mless';

export default function ContainerStates({ podId, states, timeConfig }) {
  if (!states || states.length === 0) {
    return <NoDataAvailable height={160} />;
  }

  const maxPresentedStates = 5;
  const presentedStates = states.slice(0, maxPresentedStates);

  return (
    <Fragment>
      <Table>
        <Thead>
          <Tr size="compact">
            <Th>Name</Th>
            <Th>Ready</Th>
            <Th>Status</Th>
            <Th>Message</Th>
            <Th>CPU Total %</Th>
            <Th>Memory Usage</Th>
          </Tr>
        </Thead>
        <Tbody>
          {presentedStates.map((status, i) => (
            <Tr key={i}>
              <Td>{status.name}</Td>
              <Td>
                <ReadyIcon isReady={status.ready} />
              </Td>
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
                  />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <div className={locals.wrapper}>
        <Link className={locals.viewAllLink} href$={getPodDashboard(podId, { tab: '/containers' })}>
          View all Containers
        </Link>
      </div>
    </Fragment>
  );
}
