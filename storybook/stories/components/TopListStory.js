import { action } from '@storybook/addon-actions';
import {storiesOf} from '@storybook/react';
import React from 'react';

import TopListPresenter from 'in-components/TopList/TopListPresenter';
import { millis } from 'in-services/formatters/number';
import Link from 'in-components/Link';
import Root from '../_helpers/Root';

const onChangeMetric = action('onChangeMetric');

const metrics = ['latency', 'selfLatency', 'calls', 'errors'];
const labels = ['Elapsed Latency', 'Self Latency', 'Calls', 'Errors'];

// TODO Delete completely? There's no 1.0 TopList component.
storiesOf('components/TopList', module)
  .add('pending', () => <DefaultTopListConfig result={{
    progress: {
      loading: true
    },
    errors: []
  }} />)
  .add('error', () => <DefaultTopListConfig result={{
    progress: {
      loading: false
    },
    errors: [{
      message: 'Unexpected server error',
      code: 'SERVER'
    }]
  }} />)
  .add('no data', () => <DefaultTopListConfig result={{
    progress: {
      loading: false
    },
    errors: [],
    data: {
      items: [],
      page: 1,
      pageSize: 5,
      totalHits: 0
    }
  }} />)
  .add('with data', () => <DefaultTopListConfig result={{
    progress: {
      loading: false
    },
    errors: [],
    data: {
      items: [
        {
          label: 'productdb',
          metrics: {
            metric: [[0, 234]]
          }
        },
        {
          label: 'shop',
          metrics: {
            metric: [[0, 128]]
          }
        },
        {
          label: 'recommendations',
          metrics: {
            metric: [[0, 64]]
          }
        }
      ],
      page: 1,
      pageSize: 5,
      totalHits: 3
    }
  }} />);

function DefaultTopListConfig({result}) {
  return (
    <Root>
      <TopListPresenter
        result={result}
        metrics={metrics}
        labels={labels}
        onChangeMetric={onChangeMetric}
        selectedMetric="selfLatency"
        selectedMetricFormatter={millis.compact}
        renderViewAll={ViewAll}
        renderLabel={Label}
        renderMetric={Metric}
      />
    </Root>
  );
}

function ViewAll() {
  return <Link href="https://instana.com">View All</Link>;
}

function Label({ item }) {
  return <Link href="https://instana.com">{item.label}</Link>;
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
