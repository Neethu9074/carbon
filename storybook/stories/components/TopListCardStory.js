import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { Fragment } from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { Row, Col } from 'in-new-components/layout/Grid';
import { millis } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';
import Root from '../_helpers/Root';

const onChangeMetric = action('onChangeMetric');

const metrics = ['latency', 'selfLatency', 'calls', 'errors'];
const labels = ['Elapsed Latency', 'Self Latency', 'Calls', 'Errors'];

storiesOf('Components/Top-List Card', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <Row>
        <Col lg={6}>
          <h3>Indeterminate Loading</h3>
          <TopListItem
            title="Top Endpoints"
            result={{
              progress: {
                loading: true
              },
              errors: []
            }}
          />
        </Col>
        <Col lg={6}>
          <h3>Determinate Loading</h3>
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
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <h3>Server Error</h3>
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
        </Col>
        <Col lg={6}>
          <h3>Client Error</h3>
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
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <h3>No Data Found</h3>
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
        </Col>
        <Col lg={6}>
          <h3>Endpoints Loaded Successfully</h3>
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
        </Col>
      </Row>
    </Root>
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
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
    />
  );
}

function ViewAll(props, className) {
  return (
    <Link className={className} href="https://instana.com">
      View All
    </Link>
  );
}

function Label({ item }, _item, className) {
  return (
    <Fragment>
      <SvgIcon type="application" width={16} height={16} style={{ marginRight: '0.5rem' }} />
      <Link className={className} href="https://instana.com">
        {item.label}
      </Link>
    </Fragment>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
