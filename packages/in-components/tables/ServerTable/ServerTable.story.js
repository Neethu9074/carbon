/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { millis, percentage, number } from 'in-services/formatters/number';

const onChange = action('onChange');

export default {
  component: ServerTablePresenter
};

export function Pending(props) {
  return (
    <>
      <h2>Pending Table</h2>
      <p>
        The following table visualizes what a table looks like when it is in the process of retrieving data from the
        server.
      </p>
      <WrappedTable
        {...props}
        result={{
          progress: {
            loading: true
          },
          errors: []
        }}
      />
    </>
  );
}
Pending.args = { renderAsCard: false, cardTitle: 'Top Something' };

function WrappedTable({ renderAsCard, cardTitle, ...props }) {
  return (
    <ServerTablePresenter
      onChange={onChange}
      columnDefinitions={columnDefinitions}
      query=""
      page={1}
      orderBy="label"
      orderDirection="ASC"
      pageSize={10}
      cardTitle={renderAsCard ? cardTitle : null}
      {...props}
    />
  );
}

export function Error(props) {
  return (
    <>
      <h2>Failed Data Retrieval</h2>
      <p>The following table visualizes what a table looks like when data retrieval has failed.</p>
      <WrappedTable
        {...props}
        result={{
          progress: {
            loading: false
          },
          errors: [
            {
              message: 'Unexpected server error',
              code: 'SERVER'
            }
          ]
        }}
      />
    </>
  );
}
Error.args = { renderAsCard: false, cardTitle: 'Top Something' };

export function Empty(props) {
  return (
    <>
      <h2>Empty</h2>
      <p>When no rows could be found, then the table looks like this.</p>
      <WrappedTable
        {...props}
        result={{
          progress: {
            loading: false
          },
          errors: [],
          data: {
            items: [],
            page: 1,
            pageSize: 10,
            totalHits: 0
          }
        }}
      />
    </>
  );
}
Empty.args = { renderAsCard: false, cardTitle: 'Top Something' };

export function EmptyWithNoDataAvailableRenderer(props) {
  return (
    <>
      <h2>Empty with special renderer</h2>
      <p>When no rows exist, then we can tweak the table to look like this.</p>
      <WrappedTable
        {...props}
        noDataMessage={'Empty bottle.'}
        renderNoDataAvailable={text => (
          <p>
            Own renderer, can render given custom message: <strong>{text}</strong>{' '}
          </p>
        )}
        result={{
          progress: {
            loading: false
          },
          errors: [],
          data: {
            items: [],
            page: 1,
            pageSize: 10,
            totalHits: 0
          }
        }}
      />
    </>
  );
}
EmptyWithNoDataAvailableRenderer.args = { renderAsCard: false, cardTitle: 'Top Something' };

export function WithData(props) {
  return (
    <>
      <h2>With Data</h2>
      <p>Last but not least, a table with some rows.</p>
      <WrappedTable
        {...props}
        result={{
          progress: {
            loading: false
          },
          errors: [],
          data: {
            items,
            page: 1,
            pageSize: 10,
            totalHits: 42
          }
        }}
      />
    </>
  );
}
WithData.args = { renderAsCard: false, cardTitle: 'Top Something' };

export function Configurable(props) {
  return (
    <>
      <h2>Configurable</h2>
      <WrappedTable
        {...props}
        result={{
          progress: {
            loading: false
          },
          errors: [],
          data: {
            items,
            page: 1,
            pageSize: 10,
            totalHits: 42
          }
        }}
        columnDefinitions={columnDefinitions.map(columnDefinition => {
          columnDefinition.optional = true;
          return columnDefinition;
        })}
      />
    </>
  );
}
Configurable.args = { renderAsCard: false, cardTitle: 'Top Something' };

const items = ['Stan', 'Iron Man', 'Shenlong', 'BB-8', 'R2-D2'].sort();

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return <span>{item}</span>;
    },
    width: '1rem'
  },
  {
    id: 'Endpoints',
    getContent() {
      return <>42</>;
    }
  },
  {
    id: 'Calls',
    getContent() {
      return (
        <SparkChart
          timeframe={{ windowSize: 6000, to: 6000 }}
          metrics={[
            [0, 10],
            [1000, 15],
            [2000, 4],
            [3000, 3],
            [4000, 13],
            [5000, 20],
            [6000, 16]
          ]}
          metric={67}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'Latency',
    getContent() {
      return (
        <SparkChart
          timeframe={{ windowSize: 6000, to: 6000 }}
          metrics={[
            [0, 100],
            [1000, 105],
            [2000, 400],
            [3000, 30],
            [4000, 130],
            [5000, 200],
            [6000, 160]
          ]}
          metric={145}
          tooltipFormatter={millis.compact}
        />
      );
    }
  },
  {
    id: 'Errors',
    getContent() {
      return (
        <SparkChart
          timeframe={{ windowSize: 6000, to: 6000 }}
          metrics={[
            [0, 0.1],
            [1000, 0.05],
            [2000, 0.25],
            [3000, 0.1],
            [4000, 0.3],
            [5000, 0],
            [6000, 0.1]
          ]}
          metric={0.12}
          tooltipFormatter={percentage.detailed}
        />
      );
    }
  }
];
