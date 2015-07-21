'use strict';

import React from 'react/addons';
import Immutable from 'immutable';

import MetricTree from './MetricTree';
import MetricTreeLeaf from './MetricTreeLeaf';
import Icon from 'instana-ui-components/Icon';
import * as metricsStore from 'instana-ui-services/stores/metrics';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import './Metrics.less';


const metricTree = Immutable.fromJS({
  children: [
    {
      icon: 'metrics_cpu',
      label: 'CPU',
      children: [
        {
          icon: 'metrics_cpu',
          label: 'Load',
          longLabel: 'CPU Load',
          metrics: [{name: 'load.1min', label: 'Load'}]
        },
        {
          icon: 'metrics_cpu_usage',
          label: 'Usage',
          longLabel: 'CPU Usage',
          metrics: [
            {name: 'cpu.total.user', label: 'User'},
            {name: 'cpu.total.sys', label: 'System'},
            {name: 'cpu.total.wait', label: 'Wait'},
            {name: 'cpu.total.nice', label: 'Nice'},
            {name: 'cpu.total.steal', label: 'Steal'}
          ]
        }
      ]
    },
    {
      icon: 'metrics_memory',
      label: 'Memory',
      longLabel: 'Memory free',
      metrics: [{name: 'memory.free', label: 'Memory free'}]
    },
    {
      icon: 'metrics_network',
      label: 'Network',
      children: [
        {
          icon: '',
          label: 'Established',
          longLabel: 'TCP Established',
          metrics: [{name: 'tcp.established', label: 'Established'}]
        }
      ]
    }
  ]
});

const block = 'in-sidebar-metrics';

const Metrics = React.createClass({
  mixins: [SubscriptionMixin],

  getInitialState() {
    return {
      path: Immutable.List(),
      activeMetric: null
    };
  },

  componentDidMount() {
    this.addSubscription(
      metricsStore.metricPath.subscribe(path => this.setState({path}))
    );

    this.addSubscription(
      metricsStore.activeMetric
        .subscribe(activeMetric => this.setState({activeMetric}))
    );
  },

  render() {
    return (
      <div className={block}>
        {this.renderHeader()}
        {metricTree.get('children').map(child => this.getMetricsToShow(child))}
      </div>
    );
  },

  renderHeader() {
    const style = this.state.activeMetric ? {opacity: 1} : {opacity: 0.25};

    return (
      <div className={block + '__header'}>
        <div className={block + '__clear-button'}
             style={style}
             onClick={() => metricsStore.activeMetric.emit(null)}>
          CLEAR
          <Icon className={block + '__icon'} type='delete' />
        </div>
      </div>
    );
  },

  getMetricsToShow(root) {
    const children = root.get('children');
    const label = root.get('label');

    if(!children) {
      return <MetricTreeLeaf key={label} metricObject={root} />;
    }

    return (
      <MetricTree key={label} header={label}>
        {root.get('children').map(child => this.getMetricsToShow(child))}
      </MetricTree>
    );
  }
});

export default Metrics;
