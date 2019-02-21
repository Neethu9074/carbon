import React from 'react';

import { Td, Table, Thead, Tbody, Tr, Th } from 'in-components/tables/sharedComponents';
import ReadyIcon from 'in-kubernetes/Dashboards/commonComponents/ReadyIcon';

export default function ContainerStates({ states }) {
  if (!states) {
    return null;
  }

  return (
    <Table>
      <Thead>
        <Tr size="compact">
          <Th>Name</Th>
          <Th>Ready</Th>
          <Th>Status</Th>
          <Th>Message</Th>
        </Tr>
      </Thead>
      <Tbody>
        {states.map((status, i) => (
          <Tr key={i}>
            <Td>{status.name}</Td>
            <Td>
              <ReadyIcon isReady={status.ready} />
            </Td>
            <Td>{status.state.status}</Td>
            <Td>{status.message || '-'}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
