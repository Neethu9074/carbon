import React from 'react/addons';

import {getLiveMetrics} from 'in-stores/metric';

const rpt = React.PropTypes;
export default React.createClass({
  displayName: 'MetricValue',

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    createMetricValueStream: rpt.func,
    metric: rpt.string.isRequired,
    initialValue: rpt.string,
    formatter: rpt.func
  },

  componentDidMount() {
    this.establishSubscription(this.getStream(this.props));
  },

  getStream(props) {
    if (props.createMetricValueStream) {
      return props.createMetricValueStream();
    }

    return getLiveMetrics({
      snapshotId: props.snapshotId,
      metric: props.metric
    });
  },

  establishSubscription(stream) {
    const node = React.findDOMNode(this);

    if (this.props.initialValue) {
      node.textContent = this.props.initialValue;
    } else {
      node.textContent = '';
    }

    this.stream = stream;
    this.subscription = stream.subscribe(v => {
      node.textContent = this.format(v[1]);
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
    return <span/>;
  }

});
