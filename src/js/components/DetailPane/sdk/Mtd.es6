'use strict';

import React from 'react/addons';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

const Mtd = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin],

  getInitialState() {
    return {
      metricValue: null
    };
  },

  componentDidMount() {
    this.establishSubscription(this.props);
  },

  establishSubscription(props) {
    const stream = props.createMetricValueStream();
    this.addSubscription(
      stream.subscribe(metricValue => this.setState({metricValue}))
    );
  },

  componentWillReceiveProps(nextProps) {
    this.setState({metricValue: null});
    this.disposeSubscriptions();
    this.establishSubscription(nextProps);
  },

  render() {
    return <td>{this.state.metricValue}</td>;
  }

});

export default Mtd;
