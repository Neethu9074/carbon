import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import ReadyIcon from 'in-kubernetes/Dashboards/commonComponents/ReadyIcon';

import locals from './PodStatusTooltipContent.mless';

export default function PodStatusTooltipContent({ pod }) {
  const podStatus = pod.status || {};
  const allContainerStatuses = [...podStatus.initContainerStatuses, ...podStatus.containerStatuses];

  return (
    <div className={locals.tooltip}>
      <div className={locals.podPhaseLabel}>{`Pod Phase:  ${podStatus.phase || pod.phase}`}</div>

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
            <Tr size="compact">
              <Td className={locals.summaryCell}>Summary</Td>
              <Td className={locals.summaryCell}>{podStatus.statusSummary}</Td>
              <Td className={locals.summaryCell}>{`${podStatus.containerStatuses.filter(c => c.ready).length}/${
                podStatus.containerStatuses.length
              }`}</Td>
            </Tr>
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
