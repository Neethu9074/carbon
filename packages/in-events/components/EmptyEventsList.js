import React from 'react';

import HighlightedTimeframeMarkerRow from 'in-events/components/HighlightedTimeframeMarkerRow';
import { Table, Th, Thead, Td, Tbody, Tr } from 'in-components/tables/sharedComponents';
import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';

import locals from './EmptyEventsList.mless';

export default function EventsList({ eventType, cols, isDenseList, isPresentingHighlightedTimeframe }) {
  if (isDenseList) {
    return (
      <Table>
        <Thead>
          <Tr size="compact">
            <Th>Started</Th>
          </Tr>
        </Thead>
        <Tbody />
      </Table>
    );
  }

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
        {isPresentingHighlightedTimeframe && <HighlightedTimeframeMarkerRow cols={cols} />}
        <Tr className={locals.row}>
          <Td colSpan={cols}>
            <CenterAlignmentColumn>
              <EntityPageMainNotification
                title={`No ${entityType} available`}
                icon="lib_missing_data"
                explanation={`There were no ${entityType} retrieved for the selected time range`}
              />
            </CenterAlignmentColumn>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
