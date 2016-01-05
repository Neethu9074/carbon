import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import MetricConveyer from 'in-services/conveyer/MetricConveyer';
import {create} from 'in-services/conveyer';

const rpt = React.PropTypes;
const MetricValue = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map,
    metric: rpt.string,
    createMetricValueStream: rpt.func,
    formatter: rpt.func
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.establishSubscription(this.getStream(this.props));
  },

  getStream(props) {
    if (props.createMetricValueStream) {
      return props.createMetricValueStream();
    }

    return create(MetricConveyer, {
      snapshot: props.snapshot,
      metric: props.metric
    });

  },

  establishSubscription(stream) {
    const node = React.findDOMNode(this);
    this.stream = stream;
    this.addSubscription(stream.subscribe(v => {
      node.textContent = this.format(v);
    }));
  },

  componentWillReceiveProps(nextProps) {
    const nextStream = this.getStream(nextProps);
    if (this.stream !== nextStream) {
      this.setState(this.getInitialState());
      this.disposeSubscriptions();
      this.establishSubscription(nextStream);
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

export default MetricValue;
