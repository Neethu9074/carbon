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
    const stream = this.props.createMetricValueStream();
    // TODO Ben handle update?
    this.addSubscription(
      stream.subscribe(metricValue => this.setState({metricValue}))
    );
  },

  render() {
    return <td>{this.state.metricValue}</td>;
  }

});

export default Mtd;
