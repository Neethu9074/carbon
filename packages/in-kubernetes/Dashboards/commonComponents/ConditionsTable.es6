import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import Card from 'in-new-components/Card';

export default function ConditionsTable({ conditions }) {
  return (
    <Card title="Conditions">
      <Table tableInCard>
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Message</Th>
            <Th>last Transition Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(conditions || []).map((condition, i) => (
            <Tr key={i} size="compact">
              <Td>{condition.type}</Td>
              <Td>{condition.status}</Td>
              <Td>{condition.message}</Td>
              <Td>{formatDateTime(condition.lastTransitionTime)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
