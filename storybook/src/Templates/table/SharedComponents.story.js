/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@instana/components';
import ConfigurableTh from 'in-components/tables/sharedComponents/ConfigurableTh';

export default {
  title: 'Templates|table/Table',
  component: Table
};

export function TableWithConfigurableCellContent() {
  return (
    <>
      <Table>
        <Thead>
          <Tr size="minimal">
            <Th>Label</Th>
            <Th noWrap>Calls</Th>
            <Th noWrap>Time</Th>
            <Th noWrap>Latency</Th>
            <ConfigurableTh>Error Rate</ConfigurableTh>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>This is a label</Td>
            <Td noWrap>97,538</Td>
            <Td noWrap>2018-08-06 10:44:28</Td>
            <Td noWrap>12ms</Td>
            <Td noWrap>0.00%</Td>
          </Tr>
          <Tr>
            <Td>This is a label</Td>
            <Td noWrap>97,538</Td>
            <Td noWrap>2018-08-06 10:44:28</Td>
            <Td noWrap>12ms</Td>
            <Td noWrap>0.00%</Td>
          </Tr>
          <Tr>
            <Td>This is a label</Td>
            <Td noWrap>97,538</Td>
            <Td noWrap>2018-08-06 10:44:28</Td>
            <Td noWrap>12ms</Td>
            <Td noWrap>0.00%</Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  );
}
