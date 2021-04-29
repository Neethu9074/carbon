/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React, { Fragment } from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { millis } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import { Link } from '@instana/components';

const onChangeMetric = action('onChangeMetric');

const metrics = ['latency', 'selfLatency', 'calls', 'errors'];
const labels = ['Elapsed Latency', 'Self Latency', 'Calls', 'Errors'];

export default {
  title: 'Organisms|TopListCard',
  component: TopListCardPresenter
};

export function IndeterminateLoading() {
  return (
    <TopListItem
      title="Top Endpoints"
      result={{
        progress: {
          loading: true
        },
        errors: []
      }}
    />
  );
}
export function DeterminateLoading() {
  return (
    <TopListItem
      title="Top Endpoints"
      result={{
        progress: {
          loading: true,
          percentage: 0.7
        },
        errors: []
      }}
    />
  );
}
export function ServerError() {
  return (
    <TopListItem
      title="Top Endpoints"
      result={{
        progress: {
          loading: false
        },
        errors: [
          {
            message: 'Unexpected server error',
            code: 'SERVER'
          },
          {
            message:
              'There was a weird validation error: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium voluptates eius commodi aut, hic amet porro ab, nostrum id tenetur, repellat repellendus aliquid totam a facere. Officiis labore, aspernatur dolor.',
            code: 'VALIDATION'
          }
        ]
      }}
    />
  );
}
export function ClientError() {
  return (
    <TopListItem
      title="Top Endpoints"
      result={{
        progress: {
          loading: false
        },
        errors: [
          {
            message: 'Unexpected client error',
            code: 'CLIENT'
          }
        ]
      }}
    />
  );
}
export function NoDataFound() {
  return (
    <TopListItem
      title="Top Endpoints"
      result={{
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
      }}
    />
  );
}
export function EndpointsLoadedSuccessfully() {
  return (
    <TopListItem
      title="Top Endpoints"
      result={{
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
      }}
    />
  );
}

function TopListItem({ title = 'Top Something', result }) {
  return (
    <TopListCardPresenter
      title={title}
      result={result}
      metrics={metrics}
      labels={labels}
      onChangeMetric={onChangeMetric}
      selectedMetric="selfLatency"
      selectedMetricFormatter={millis.compact}
      ViewAll={ViewAll}
      Label={Label}
      Metric={Metric}
    />
  );
}

function ViewAll({ className }) {
  return (
    <Link className={className} href="https://instana.com">
      View All
    </Link>
  );
}

function Label({ item, className }) {
  return (
    <Fragment>
      <SvgIcon type="lib_application_endpoint" size="xs" style={{ marginRight: '0.5rem' }} />
      <Link className={className} href="https://instana.com">
        {item.label}
      </Link>
    </Fragment>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
