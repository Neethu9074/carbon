/* eslint-disable react/no-unused-prop-types */

import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {getMetricForFocusedMoment, getHistoricMetric, getTimeWindowBasedMetricAggregation} from 'in-stores/metric';


const rpt = React.PropTypes;
export default React.createClass({
  displayName: 'MetricValue',

  mixins: [PureRenderMixin],

  propTypes: {
    createMetricValueStream: rpt.func,
    snapshotId: rpt.string.isRequired,
    timeWindowAggregation: rpt.string,
    initialValue: rpt.string,
    time: rpt.number,
    className: rpt.string,
    formatter: rpt.func,
    metric: rpt.string,
  },

  componentDidMount() {
    this.establishSubscription(this.getStream(this.props));
  },

  getStream(props) {
    if (props.createMetricValueStream) {
      return props.createMetricValueStream(this.props.snapshotId)
        .distinct();
    }

    if (props.timeWindowAggregation) {
      return getTimeWindowBasedMetricAggregation({
        snapshotId: props.snapshotId,
        metric: props.metric,
        timeWindowAggregation: props.timeWindowAggregation
      });
    }


    if (props.time) {
      return getHistoricMetric({
        snapshotId: props.snapshotId,
        metric: props.metric,
        time: props.time
      })
      .map(v => v[1])
      .distinct();
    }

    return getMetricForFocusedMoment({
      snapshotId: props.snapshotId,
      metric: props.metric
    })
    .map(v => v[1])
    .distinct();
  },

  establishSubscription(stream) {
    if (this.props.initialValue) {
      this.node.textContent = this.props.initialValue;
    } else {
      this.node.textContent = '';
    }

    this.stream = stream;
    this.subscription = stream.subscribe(v => {
      this.node.textContent = v == null ? this.props.initialValue || '' : this.format(v);
    });
  },

  componentWillUpdate(nextProps) {
    const nextStream = this.getStream(nextProps);
    if (this.stream !== nextStream) {
      this.disposeSubscription();
      this.establishSubscription(nextStream);
    }
  },

  componentWillUnmount() {
    this.disposeSubscription();
  },

  disposeSubscription() {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
  },

  format(v) {
    if (v !== undefined && this.props.formatter) {
      return this.props.formatter(v);
    }
    return v;
  },

  render() {
    return (
      <span className={this.props.className}
            ref={node => this.node = node} />
    );
  }
});
