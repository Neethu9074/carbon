import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SortableTh,
  ConfigurableTh,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow,
  SeverityIndicatorCellContentWrapper,
  ErroneousRowTh,
  ErroneousRowTd
} from 'in-components/tables/sharedComponents';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { Col, Row } from 'in-new-components/layout/Grid';

export default {
  title: 'Templates/table/Table',
  component: Table
};

export function OverviewStory() {
  return (
    <>
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
                <Td active>
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
                <ErroneousRowTh />
                <Th>Label</Th>
                <SortableTh>Calls</SortableTh>
                <SortableTh>Errors</SortableTh>
                <SortableTh>Latency</SortableTh>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <ErroneousRowTd isErroneous />
                <Td>Foo (erroneous)</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
              <Tr>
                <ErroneousRowTd isErroneous={false} />
                <Td>Bar (not erroneous)</Td>
                <Td>1</Td>
                <Td>2</Td>
                <Td>3</Td>
              </Tr>
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
                cols={5}
              />
            </Tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}

export function Loading() {
  return (
    <>
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
    </>
  );
}

export function TreeTableWithLoadMore() {
  return (
    <>
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
    </>
  );
}

export function TableWithLargeCellContent() {
  return (
    <>
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
    </>
  );
}

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
