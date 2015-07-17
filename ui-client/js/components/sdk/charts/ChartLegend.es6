'use strict';

import React from 'react';
import _ from 'lodash';
import irpt from 'react-immutable-proptypes';

import {create} from 'instana-ui-services/conveyer';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {theme} from 'instana-ui-services/theme';

import ContentHeading from '../ContentHeading';

import './ChartLegend.less';

const rpt = React.PropTypes;
const block = 'in-detail-pane__chart-legend';

const ChartLegend = React.createClass({
  mixins: [SubscriptionMixin],

  propTypes: {
    title: rpt.string.isRequired,
    snapshot: irpt.map.isRequired,
    metrics: rpt.arrayOf(rpt.string).isRequired,
    metricLabels: rpt.arrayOf(rpt.string).isRequired,
    metricValueFormatter: rpt.func
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.subscribeToMetrics(this.props);
  },

  subscribeToMetrics(props) {
    this.disposeSubscriptions();

    const datasources = props.metrics.map(metric =>
      create(MetricConveyer, {
        snapshot: props.snapshot,
        metric
      })
    );

    datasources.forEach((datasource, i) => {
      this.addSubscription(
        datasource.subscribe(value => {
          this.setState({
            [props.metrics[i]]: value
          });
        })
      );
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.snapshot !== this.props.snapshot ||
        !_.isEqual(nextProps.metrics, this.props.metrics)) {
      this.subscribeToMetrics(nextProps);
    }
  },

  render() {
    return (
      <div className={block + '-heading'}>
        <ContentHeading>
          {this.props.title}
        </ContentHeading>

        <dl className={block + '-metrics'}>
          {this.props.metrics.map((metric, i) =>
            <div className={block + '-metric'}
                 key={metric}>
              <dt className={block + '-metric-title'}
                  style={{color: theme.chart.strokeColors[i]}}>
                {this.props.metricLabels[i]}
              </dt>
              <dt className={block + '-metric-value'}>
                {this.state[metric] === undefined ?
                  '?'
                : this.formatValue(this.state[metric])}
              </dt>
            </div>
          )}
        </dl>
      </div>
    );
  },

  formatValue(d) {
    if (this.props.metricValueFormatter) {
      return this.props.metricValueFormatter(d);
    } else {
      return d;
    }
  }
});

export default ChartLegend;
