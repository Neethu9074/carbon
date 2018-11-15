import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td, SortableTh } from 'in-components/tables/sharedComponents';
import Card from 'in-new-components/Card';

export default function Selector() {
  return (
    <Card title="Selector">
      <Table tableInCard>
        <Thead>
          <Tr>
            <Th>Key</Th>
            <SortableTh>Operator</SortableTh>
            <SortableTh>Value</SortableTh>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>foo</Td>
            <Td>=</Td>
            <Td>bar</Td>
          </Tr>
          <Tr>
            <Td>foo</Td>
            <Td>=</Td>
            <Td>bar</Td>
          </Tr>
          <Tr>
            <Td>foo</Td>
            <Td>=</Td>
            <Td>bar</Td>
          </Tr>
        </Tbody>
      </Table>
    </Card>
  );
}
