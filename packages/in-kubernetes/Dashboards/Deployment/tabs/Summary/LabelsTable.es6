import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import Card from 'in-new-components/Card';

export default function LabelsTable({ deployment }) {
  return (
    <Card title="Labels">
      <Table tableInCard>
        <Thead>
          <Tr>
            <Th>Key</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(deployment.labels || []).map((label, i) => (
            <Tr key={i} size="compact">
              <Td>{label.key}</Td>
              <Td>{label.value}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
