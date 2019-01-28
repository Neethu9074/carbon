import React from 'react';

import { Checkmark, ErrorTriangle } from 'in-kubernetes/Dashboards/commonComponents/icons';
import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import { deepCopy } from 'in-services/util/object';
import { compare } from 'in-services/util/boolean';
import Card from 'in-new-components/Card';

export default function ComponentStatusTable({ cluster }) {
  return (
    <Card title="Component Statuses">
      <Table tableInCard>
        <Thead>
          <Tr>
            <Th>Health</Th>
            <Th>Component</Th>
            <Th>Message</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(deepCopy(cluster.componentStatuses) || [])
            .sort((a, b) => compare(a.healthy, b.healthy))
            .map((componentStatus, i) => (
              <Tr key={i} size="compact">
                <Td>{componentStatus.healthy ? <Checkmark /> : <ErrorTriangle />}</Td>
                <Td>{componentStatus.name}</Td>
                {!componentStatus.healthy && <Td>{componentStatus.message}</Td>}
                {componentStatus.healthy && <Td />}
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Card>
  );
}
