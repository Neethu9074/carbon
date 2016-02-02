import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getLiveMetrics} from 'in-stores/metric';

const rpt = React.PropTypes;
export default React.createClass({
  displayName: 'MetricValue',

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired,
    metric: rpt.string.isRequired,
    formatter: rpt.func,
    createMetricValueStream: rpt.func
  },

  componentDidMount() {
    this.establishSubscription(this.getStream(this.props));
  },

  getStream(props) {
    if (props.createMetricValueStream) {
      return props.createMetricValueStream();
    }

    return getLiveMetrics(props.snapshot.get('id'), props.metric);
  },

  establishSubscription(stream) {
    const node = React.findDOMNode(this);
    this.stream = stream;
    this.subscription = stream.subscribe(v => {
      node.textContent = this.format(v.value);
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
