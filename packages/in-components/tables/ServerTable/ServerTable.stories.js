/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { just } from '@instana/observables';

import ServerTablePresenterStory from 'in-components/tables/ServerTable/ServerTablePresenter.stories';
import ServerTable from 'in-components/tables/ServerTable/ServerTable';
import { success, error } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';

export default {
  component: ServerTable,
  argTypes: {
    cardTitle: {
      control: {
        type: 'text'
      }
    },
    defaultOrderDirection: {
      control: 'select',
      options: ['ASC', 'DESC']
    },
    defaultOrderBy: {
      table: {
        disable: true
      }
    },
    get: {
      table: {
        disable: true
      }
    }
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
    cardTitle: null,
    columnDefinitions: ServerTablePresenterStory.args.columnDefinitions,
    defaultOrderBy: 'label',
    defaultOrderDirection: 'ASC',
    defaultPageSize: 10,
    defaultQuery: '',
    paginationResettingProps: []
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
    columnDefinitions: ServerTablePresenterStory.args.columnDefinitions.map(columnDefinition => {
      columnDefinition.optional = true;
      return columnDefinition;
    }),
    result: WithData.args.result
  }
};

// internal
function WrappedTable({ cardTitle, result, ...props }) {
  return <ServerTable get={() => just(result)} cardTitle={cardTitle} {...props} />;
}

function items() {
  return ['Stan', 'Iron Man', 'Shenlong', 'BB-8', 'R2-D2'].sort();
}
