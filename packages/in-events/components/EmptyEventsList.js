import React from 'react';

import { Table, Th, Thead, Td, Tbody, Tr } from 'in-components/tables/sharedComponents';
import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';

export default function EventsList({ eventType }) {
  const entityType = eventType ? eventType + 's' : 'events';
  return (
    <Table>
      <Thead>
        <Tr size="compact">
          <Th>Title</Th>
          <Th>Started</Th>
          <Th>End</Th>
          <Th>On</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td colSpan={5}>
            <CenterAlignmentColumn>
              <EntityPageMainNotification
                title={`No ${entityType} available`}
                icon=""
                explanation={`There were no ${entityType} retrieved for the selected time range`}
              />
            </CenterAlignmentColumn>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
