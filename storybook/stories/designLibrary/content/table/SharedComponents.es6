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
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow,
  SeverityIndicatorCellContentWrapper
} from 'in-components/tables/sharedComponents';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { Col, Row } from 'in-new-components/layout/Grid';
import Root from '../../../_helpers/Root';

storiesOf('designLibrary/Content/table/Shared Components', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <h1>Overview</h1>

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
                <Td>
                  <SeverityIndicatorCellContentWrapper severity={10}>Foo</SeverityIndicatorCellContentWrapper>
                </Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr>
                <Td>
                  <SeverityIndicatorCellContentWrapper severity={null}>Bar</SeverityIndicatorCellContentWrapper>
                </Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr>
                <Td>
                  <SeverityIndicatorCellContentWrapper severity={0}>Foo</SeverityIndicatorCellContentWrapper>
                </Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr active>
                <Td>
                  <SeverityIndicatorCellContentWrapper severity={0}>Active row</SeverityIndicatorCellContentWrapper>
                </Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr>
                <Td>
                  <SeverityIndicatorCellContentWrapper severity={5}>
                    Kevelaer, <br /> Kleve
                  </SeverityIndicatorCellContentWrapper>
                </Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <LoadMoreRow cols={4} />
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
              <ErrorRows
                errors={[
                  {
                    message: 'Unexpected server error',
                    code: 'SERVER'
                  },
                  {
                    message: 'You did not fill out the form',
                    code: 'CLIENT'
                  }
                ]}
                cols={4}
              />
            </Tbody>
          </Table>
        </Col>
      </Row>

      <h1>Loading State</h1>

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
              <HorizontalIndicatorRow cols={4} progress={indeterminateProgress} />
              <LoadingSkeletonRows cols={4} />
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
              <HorizontalIndicatorRow cols={4} progress={indeterminateProgress} />
            </Tbody>
          </Table>
        </Col>
      </Row>

      <h1>Tree Table with Load More</h1>

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
                <Td>Example</Td>
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
              <Tr depth={2}>
                <Td>Example</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr depth={2}>
                <Td>Example</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr depth={2}>
                <Td>Example</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <LoadMoreRow cols={4} depth={2} />
              <Tr>
                <Td>Example</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr depth={2}>
                <Td>Example</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr depth={2}>
                <Td>Example</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <LoadMoreRow cols={4} depth={2} />
              <LoadMoreRow cols={4} depth={1} />
            </Tbody>
          </Table>
        </Col>
      </Row>

      <h1>Table with large cell content</h1>

      <Table>
        <Thead>
          <Tr>
            <Th>Label</Th>
            <SortableTh noWrap>Calls</SortableTh>
            <SortableTh noWrap>Time</SortableTh>
            <SortableTh noWrap>Latency</SortableTh>
            <SortableTh noWrap>Error Rate</SortableTh>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td ellipsis="60vw">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex placeat eum voluptatibus modi vel odit illo
              cum et, totam nisi incidunt sapiente tempore quibusdam sed! Amet dolore ad laudantium molestiae! Lorem
              ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, nam, architecto? Ab unde nam, quibusdam
              nesciunt dolore enim cum asperiores qui consequuntur voluptates repudiandae quia soluta delectus tenetur
              accusantium sed.
            </Td>
            <Td noWrap>97,538</Td>
            <Td noWrap>2018-08-06 10:44:28</Td>
            <Td noWrap>12ms</Td>
            <Td noWrap>0.00%</Td>
          </Tr>
          <Tr>
            <Td ellipsis="60vw">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex placeat eum voluptatibus modi vel odit illo
              cum et
            </Td>
            <Td noWrap>97,538</Td>
            <Td noWrap>2018-08-06 10:44:28</Td>
            <Td noWrap>12ms</Td>
            <Td noWrap>0.00%</Td>
          </Tr>
          <Tr>
            <Td ellipsis="60vw">GET /:repository/search/:search</Td>
            <Td noWrap>97,538</Td>
            <Td noWrap>2018-08-06 10:44:28</Td>
            <Td noWrap>12ms</Td>
            <Td noWrap>0.00%</Td>
          </Tr>
        </Tbody>
      </Table>
    </Root>
  );
}
