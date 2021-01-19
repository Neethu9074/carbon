/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';

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
            <Td>{condition.lastTransitionTime || valueMissingPlaceholder}</Td>
            <Td>{condition.reason || valueMissingPlaceholder}</Td>
            <Td>{condition.message || valueMissingPlaceholder}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
