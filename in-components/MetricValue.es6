import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import React from 'react';

import {getMetricForFocusedMoment, getHistoricMetric} from 'in-stores/metric';


const rpt = React.PropTypes;
export default React.createClass({
  displayName: 'MetricValue',

  mixins: [PureRenderMixin],

  propTypes: {
    createMetricValueStream: rpt.func,
    snapshotId: rpt.string.isRequired,
    initialValue: rpt.string,
    timeframeTo: rpt.number,
    className: rpt.string,
    formatter: rpt.func,
    metric: rpt.string
  },

  componentDidMount() {
    this.establishSubscription(this.getStream(this.props));
  },

  getStream(props) {
    if (props.createMetricValueStream) {
      return props.createMetricValueStream(this.props.snapshotId)
        .distinct();
    }

    if (props.timeframeTo) {
      return getHistoricMetric({
        snapshotId: props.snapshotId,
        metric: props.metric,
        time: props.timeframeTo
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
    const node = ReactDOM.findDOMNode(this);

    if (this.props.initialValue) {
      node.textContent = this.props.initialValue;
    } else {
      node.textContent = '';
    }

    this.stream = stream;
    this.subscription = stream.subscribe(v => {
      node.textContent = v == null ? this.props.initialValue || '' : this.format(v);
    });
  },

  componentWillReceiveProps(nextProps) {
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
    return <span className={this.props.className} />;
  }
});
