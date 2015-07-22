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
      label: 'CPU',
      children: [
        {
          label: 'Load',
          metrics: [{name: 'load.1min', label: 'Load'}]
        },
        {
          label: 'Usage',
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
      label: 'Memory',
      children: [
        {
          label: 'Free',
          metrics: [{name: 'memory.free', label: 'Memory free'}]
        }
      ]

    },
    {
      label: 'Network',
      children: [
        {
          label: 'Network 2',
          children: [
            {
              label: 'Established',
              metrics: [{name: 'tcp.established', label: 'Established'}]
            },
            {
              label: 'Test 2',
              metrics: [{name: 'm', label: 'Test 2  '}]
            }
          ]
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
        {metricTree.get('children').map(child =>
          this.getMetricsToShow(child, 0))}
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

  getMetricsToShow(root, level) {
    const children = root.get('children');
    const label = root.get('label');

    if(!children) {
      return <MetricTreeLeaf key={label} metricObject={root} />;
    }

    return (
      <MetricTree key={label} header={{text: label, level}}>
        {root.get('children').map(child => this.getMetricsToShow(child, level + 1))}
      </MetricTree>
    );
  }
});

export default Metrics;
