import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';

export default function NodeConditionsPresenter({ conditions }) {
  return (
    <Table tableInCard>
      <Thead>
        <Tr size="compact">
          <Th>Condition</Th>
          <Th>Status</Th>
          <Th>Last Transition Time</Th>
          <Th>Reason</Th>
          <Th>Message</Th>
        </Tr>
      </Thead>
      <Tbody>
        {conditions.map(condition => (
          <Tr key={condition.type} size="compact">
            <Td>{condition.type}</Td>
            <Td>{condition.status}</Td>
            <Td>{condition.lastTransitionTime}</Td>
            <Td>{condition.reason}</Td>
            <Td>{condition.message || '-'}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
