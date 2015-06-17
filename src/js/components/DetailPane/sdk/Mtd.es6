'use strict';

import React from 'react/addons';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

const Mtd = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin],

  getInitialState() {
    return {
      metricValue: undefined
    };
  },

  componentDidMount() {
    this.establishSubscription(this.props.createMetricValueStream());
  },

  establishSubscription(stream) {
    this.stream = stream;
    this.addSubscription(
      stream.subscribe(metricValue => this.setState({metricValue}))
    );
  },

  componentWillReceiveProps(nextProps) {
    const nextStream = nextProps.createMetricValueStream();
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
    return <td>{this.format(this.state.metricValue)}</td>;
  }

});

export default Mtd;
