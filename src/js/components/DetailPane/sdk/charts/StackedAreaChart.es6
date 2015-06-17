'use strict';

import React from 'react';
import _ from 'lodash';

import LineChart from 'instana-ui-components/LineChart';
import {create} from 'instana-ui-services/conveyer';
import MetricWithHistoryConveyer from 'instana-ui-services/conveyer/MetricWithHistoryConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {theme} from 'instana-ui-services/theme';
import ContentHeading from '../ContentHeading';

import './StackedAreaChart.less';

const block = 'in-detail-pane__stacked-area-chart';

const StackedAreaChart = React.createClass({

  mixins: [SubscriptionMixin],

  getInitialState() {
    return {
      datasources: null
    };
  },

  componentDidMount() {
    this.subscribeToMetrics(this.props);
  },

  subscribeToMetrics(props) {
    this.disposeSubscriptions();

    const datasources = props.metrics.map(metric =>
      create(MetricWithHistoryConveyer, {
        snapshot: props.snapshot,
        metric,
        timeframe: props.timeframe
      })
    );

    datasources.forEach((datasource, i) => {
      this.addSubscription(
        datasource.subscribe(dataset => {
          const currentValue = dataset.values[dataset.values.length - 1][1];
          this.setState({
            [props.metrics[i]]: currentValue
          });
        })
      );
    });

    this.setState({
      datasources
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshot !== this.props.snapshot ||
        !_.isEqual(nextProps.metrics, this.props.metrics) ||
        nextProps.timeframe !== this.props.timeframe) {
      this.subscribeToMetrics(nextProps);
    }
  },

  render() {
    if (!this.state.datasources) {
      return null;
    }

    return (
      <div className={block}>
        <div className={block + '-heading'}>
          <ContentHeading>
            {this.props.title}
          </ContentHeading>

          <dl>
            {this.props.metrics.map((metric, i) =>
              <div className={block + '-metric'}
                   key={metric}>
                <dt className={block + '-metric-title'}
                    style={{color: theme.chart.strokeColors[i]}}>
                  {this.props.metricLabels[i]}
                </dt>
                <dt className={block + '-metric-value'}>
                  {this.state[metric] === undefined ?
                    0
                  : this.props.metricValueFormatter(this.state[metric])}
                  <span className={block + '-metric-percentage'}>
                    {this.props.metricUnit}
                  </span>
                </dt>
              </div>
            )}
          </dl>
        </div>

        <LineChart datasources={this.state.datasources}
                   width={this.props.width}
                   height={this.props.height}
                   yAxisTickFormatter={this.props.yAxisTickFormatter}
                   type='area' />
      </div>
    );
  }
});

export default StackedAreaChart;
