import React from 'react';

import { Checkmark, ErrorTriangle } from 'in-kubernetes/Dashboards/commonComponents/icons';
import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { compare } from 'in-services/util/boolean';
import Card from 'in-new-components/Card';

export default function ComponentStatusTable({ cluster }) {
  const componentStatuses = cluster.componentStatuses || [];
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
          {(componentStatuses || [])
            .slice()
            .sort((a, b) => compare(a.healthy, b.healthy))
            .map((componentStatus, i) => (
              <Tr key={i} size="compact">
                <Td>{componentStatus.healthy ? <Checkmark /> : <ErrorTriangle />}</Td>
                <Td>{componentStatus.name}</Td>
                {!componentStatus.healthy && <Td>{componentStatus.message}</Td>}
                {componentStatus.healthy && <Td />}
              </Tr>
            ))}
          {componentStatuses.length === 0 && (
            <Tr size="compact">
              <Td colSpan="3">
                <NoDataAvailable text="No ComponentStatus data available" height={80} />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Card>
  );
}
