import { storiesOf } from '@storybook/react';
import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SortableTh,
  HorizontalIndicatorTr,
  LoadingSkeletonRows
} from 'in-components/tables/sharedComponents';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { Col, Row } from 'in-new-components/layout/Grid';
import Root from '../../_helpers/Root';

storiesOf('content/table/Shared Components', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <Row>
        <Col xs={6}>
          <Table>
            <Thead>
              <Tr>
                <Th>Label</Th>
                <SortableTh>Calls</SortableTh>
                <SortableTh>Errors</SortableTh>
                <SortableTh>Latency</SortableTh>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Foo</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr>
                <Td>Bar</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr>
                <Td>Example</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
            </Tbody>
          </Table>
        </Col>

        <Col xs={6}>
          <Table>
            <Thead>
              <Tr>
                <Th>Label</Th>
                <SortableTh>Calls</SortableTh>
                <SortableTh>Errors</SortableTh>
                <SortableTh>Latency</SortableTh>
              </Tr>
            </Thead>
            <Tbody>
              <HorizontalIndicatorTr cols={4} progress={indeterminateProgress} />
              <LoadingSkeletonRows cols={4} />
            </Tbody>
          </Table>
        </Col>
      </Row>
    </Root>
  );
}
