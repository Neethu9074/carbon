import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import ReadyIcon from 'in-kubernetes/Dashboards/commonComponents/ReadyIcon';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';

import locals from './PodStatusTooltipContent.mless';

export default function PodStatusTooltipContent({ pod }) {
  const podStatus = pod.status || {};
  const allContainerStatuses = [...podStatus.initContainerStatuses, ...podStatus.containerStatuses];

  return (
    <div className={locals.tooltip}>
      <div className={locals.headingFlexWrapper}>
        <Table>
          <Thead>
            <Tr size="compact">
              <Th>Container</Th>
              <Th>Status</Th>
              <Th>Ready</Th>
            </Tr>
          </Thead>

          <Tbody>
            {allContainerStatuses.map(containerStatus => (
              <Tr key={containerStatus.name} size="compact">
                <Td>{containerStatus.name}</Td>
                <Td>{containerStatus.state.status}</Td>
                <Td>
                  <ReadyIcon isReady={containerStatus.ready} />
                </Td>
              </Tr>
            ))}
            {allContainerStatuses.length === 0 && (
              <Tr size="compact">
                <Td colSpan="3">
                  <NoDataAvailable text="No Containers" height={80} />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
