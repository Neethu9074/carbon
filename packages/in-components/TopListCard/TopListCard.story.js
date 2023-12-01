/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React, { Fragment } from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { millis } from 'in-services/formatters/number';

const onChangeMetric = action('onChangeMetric');

const metrics = ['latency', 'selfLatency', 'calls', 'errors'];
const labels = ['Elapsed Latency', 'Self Latency', 'Calls', 'Errors'];

export default {
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

export function WithApproximateData() {
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
      renderHistoricDataIndicator
    />
  );
}

export function WithAdditionalHelpIcon() {
  return (
    <TopListCardPresenter
      title="Top Crash Error Groups"
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
      metrics={metrics}
      labels={labels}
      onChangeMetric={onChangeMetric}
      selectedMetric="selfLatency"
      selectedMetricFormatter={millis.compact}
      ViewAll={ViewAll}
      Label={Label}
      Metric={Metric}
      config={{ metricConfiguration: { grouping: [{ maxResults: 5 }] } }}
      helpInfo="Only display data with identified users"
    />
  );
}

export function WithNoDataMessage() {
  return (
    <TopListCardPresenter
      title="Top Crash Error Groups"
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
      metrics={metrics}
      labels={labels}
      onChangeMetric={onChangeMetric}
      selectedMetric="selfLatency"
      selectedMetricFormatter={millis.compact}
      ViewAll={ViewAll}
      Label={Label}
      Metric={Metric}
      config={{ metricConfiguration: { grouping: [{ maxResults: 5 }] } }}
      noDataMessage="No Crashes during this period"
    />
  );
}

export function WithScrollbar() {
  return (
    <div style={{ height: '300px' }}>
      <TopListCardPresenter
        title="Top Crash Error Groups"
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
              },
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
        useMaxAvailableHeight
        isScrollbarVisible
        metrics={metrics}
        labels={labels}
        onChangeMetric={onChangeMetric}
        selectedMetric="selfLatency"
        selectedMetricFormatter={millis.compact}
        Label={Label}
        Metric={Metric}
        config={{ metricConfiguration: { grouping: [{ maxResults: 5 }] } }}
        helpInfo="Only display data with identified users"
      />
    </div>
  );
}

function TopListItem({ title = 'Top Something', result, renderHistoricDataIndicator }) {
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
      renderHistoricDataIndicator={renderHistoricDataIndicator}
      config={{ metricConfiguration: { grouping: [{ maxResults: 5 }] } }}
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
