'use strict';

import React from 'react/addons';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import * as metricsStore from 'instana-ui-services/stores/metrics';

import Metrics from './Metrics';
import FloatingFrame from './FloatingFrame';
import Listing from './Listing';

import './index.less';

const rpt = React.PropTypes;

const Sidebar = React.createClass({

  mixins: [React.addons.PureRenderMixin, SubscriptionMixin],

  propTypes: {
    pluginId: rpt.string.isRequired
  },

  getInitialState() {
    return {
      activeMetric: null
    };
  },

  componentDidMount() {
    this.addSubscription(
      metricsStore.activeMetric.subscribe(activeMetric => {
        if (this.refs && this.refs.metrics) {
          this.refs.metrics.close();
        }
        this.setState({activeMetric});
      })
    );
  },

  render() {
    const activeMetric = this.state.activeMetric;
    return (
      <div className='in-sidebar'>
        <FloatingFrame icon='menue'
                       title='Details'
                       content={Listing}
                       contentProps={{
                         pluginId: this.props.pluginId
                       }} />

        <FloatingFrame icon={activeMetric ? activeMetric.get('icon') : 'metrics'}
                       title={activeMetric ? activeMetric.get('longLabel') : 'Metrics'}
                       ref='metrics'
                       content={Metrics} />
      </div>
    );
  }
});

export default Sidebar;
