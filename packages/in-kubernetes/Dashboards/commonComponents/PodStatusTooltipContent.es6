import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import ReadyIcon from 'in-kubernetes/Dashboards/commonComponents/ReadyIcon';
import locals from './PodResourceTooltipContent.mless';

export default function PodStatusTooltipContent({ pod }) {
  const podStatus = pod.status || {};

  return (
    <div className={locals.tooltip}>
      <div className={locals.podPhaseLabel}>{`Pod Phase:  ${podStatus.phase || pod.phase}`}</div>

      <div className={locals.headlingFlexWrapper}>
        <Table>
          <Thead>
            <Tr size="compact">
              <Th>Container</Th>
              <Th>Status</Th>
              <Th>Ready</Th>
            </Tr>
          </Thead>

          <Tbody>
            {[...podStatus.initContainerStatuses, ...podStatus.containerStatuses].map(containerStatus => (
              <Tr key={containerStatus.name} size="compact">
                <Td>{containerStatus.name}</Td>
                <Td>{containerStatus.state.status}</Td>
                <Td>
                  <ReadyIcon isReady={containerStatus.ready} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
