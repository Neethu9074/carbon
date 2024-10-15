/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { millis, percentage, number } from 'in-services/formatters/number';
import { success, error } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';

export default {
  component: ServerTablePresenter,
  argTypes: {
    onChange: { action: 'onChange' }
  },
  decorators: [
    (story, { args }) => (
      <>
        <p>{args.title}</p>
        <WrappedTable {...args} />
      </>
    )
  ],
  // default args for all stories:
  args: {
    renderAsCard: false,
    cardTitle: 'Top Something',
    columnDefinitions: columnDefinitions(),
    query: '',
    page: 1,
    orderBy: 'label',
    orderDirection: 'ASC',
    pageSize: 10
  }
};

export const Pending = {
  args: {
    title:
      'The following table visualizes what a table looks like when it is in the process of retrieving data from the server.',
    result: pendingResult
  }
};

export const Error = {
  args: {
    title: 'The following table visualizes what a table looks like when data retrieval has failed.',
    result: error([
      {
        message: 'Unexpected server error',
        code: 'SERVER'
      }
    ])
  }
};

export const Empty = {
  args: {
    title: 'When no rows could be found.',
    result: success({
      items: [],
      page: 1,
      pageSize: 10,
      totalHits: 0
    })
  }
};

export const EmptyWithNoDataAvailableRenderer = {
  args: {
    title: 'Empty with special renderer.',
    noDataMessage: 'Empty bottle.',
    renderNoDataAvailable: text => (
      <p>
        Own renderer, can render given custom message: <strong>{text}</strong>
      </p>
    ),
    result: Empty.args.result
  }
};

export const WithData = {
  args: {
    result: success({
      items: items(),
      page: 1,
      pageSize: 10,
      totalHits: 42
    })
  }
};

export const Configurable = {
  args: {
    title: 'Configurable (means: optional columns).',
    columnDefinitions: columnDefinitions().map(columnDefinition => {
      columnDefinition.optional = true;
      return columnDefinition;
    }),
    result: WithData.args.result
  }
};

// internal helpers
function WrappedTable({ renderAsCard, cardTitle, ...props }) {
  return <ServerTablePresenter cardTitle={renderAsCard ? cardTitle : null} {...props} />;
}

function items() {
  return ['Stan', 'Iron Man', 'Shenlong', 'BB-8', 'R2-D2'].sort();
}

function columnDefinitions() {
  return [
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
      defaultSortOrder: 'DESC',
      label: 'Number of Endpoints',
      getContent(item) {
        return <>{item.length}</>;
      }
    },
    {
      id: 'Calls',
      sortable: false,
      getContent() {
        return (
          <SparkChart
            timeConfig={{ windowSize: 6000, to: 6000 }}
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
      sortable: false,
      getContent() {
        return (
          <SparkChart
            timeConfig={{ windowSize: 6000, to: 6000 }}
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
      sortable: false,
      getContent() {
        return (
          <SparkChart
            timeConfig={{ windowSize: 6000, to: 6000 }}
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
}
