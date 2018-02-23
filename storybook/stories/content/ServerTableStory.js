import { withKnobs, boolean, text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { millis, percentage, number } from 'in-services/formatters/number';
import Root from '../_helpers/Root';

const onChange = action('onChange');

storiesOf('content/ServerTable', module)
  .addDecorator(withKnobs)
  .add('Pending', () => <Pending />)
  .add('Error', () => <Error />)
  .add('Empty', () => <Empty />)
  .add('With Data', () => <WithData />);

function Pending() {
  return (
    <Root>
      <h2>Pending Table</h2>
      <p>
        The following table visualizes what a table looks like when it is in the process of
        retrieving data from the server.
      </p>
      <WrappedTable
        result={{
          progress: {
            loading: true
          },
          errors: []
        }} />
    </Root>
  );
}

function WrappedTable({result}) {
  return (
    <ServerTablePresenter
      onChange={onChange}
      columnDefinitions={columnDefinitions}
      query=""
      page={1}
      orderBy="label"
      orderDirection="ASC"
      pageSize={10}
      result={result}
      cardTitle={boolean('Render as card?', false) ? text('Card title?', 'Top Something') : null} />
  );
}

function Error() {
  return (
    <Root>
      <h2>Failed Data Retrieval</h2>
      <p>
        The following table visualizes what a table looks like when data retrieval has failed.
      </p>
      <WrappedTable
        result={{
          progress: {
            loading: false
          },
          errors: [{
            message: 'Unexpected server error',
            code: 'SERVER'
          }]
        }} />
    </Root>
  );
}

function Empty() {
  return (
    <Root>
      <h2>Empty</h2>
      <p>
        When no rows could be found, then the table looks like this.
      </p>
      <WrappedTable
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
        }} />
    </Root>
  );
}

function WithData() {
  return (
    <Root>
      <h2>With Data</h2>
      <p>
        Last but not least, a table with some rows.
      </p>
      <WrappedTable
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
        }} />
    </Root>
  );
}

const items = [
  'Stan',
  'Iron Man',
  'Shenlong',
  'BB-8',
  'R2-D2'
].sort();

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return <span>{item}</span>;
    }
  },
  {
    id: 'Endpoints',
    getContent() {
      return 42;
    }
  },
  {
    id: 'Calls',
    getContent() {
      return (
        <SparkChart
          timeframe={{ windowSize: 6000, to: 6000 }}
          metrics={[[0, 10], [1000, 15], [2000, 4], [3000, 3], [4000, 13], [5000, 20], [6000, 16]]}
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
          metrics={[[0, 100], [1000, 105], [2000, 400], [3000, 30], [4000, 130], [5000, 200], [6000, 160]]}
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
          metrics={[[0, 0.1], [1000, 0.05], [2000, 0.25], [3000, 0.1], [4000, 0.3], [5000, 0], [6000, 0.1]]}
          metric={0.12}
          tooltipFormatter={percentage.detailed}
        />
      );
    }
  }
];
