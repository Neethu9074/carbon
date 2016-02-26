import Immutable from 'immutable';
import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import * as metricsStore from 'in-services/stores/metrics';

import MetricTreeLeaf from './MetricTreeLeaf';
import ResetButton from './ResetButton';
import MetricTree from './MetricTree';
import ListHeader from './ListHeader';

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
            {name: 'cpu.user', label: 'User'},
            {name: 'cpu.sys', label: 'System'},
            {name: 'cpu.wait', label: 'Wait'},
            {name: 'cpu.nice', label: 'Nice'},
            {name: 'cpu.steal', label: 'Steal'}
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
    }
  ]
});

const block = 'in-sidebar-metrics';

const Metrics = React.createClass({
  mixins: [
    SubscriptionMixin
  ],

  getInitialState() {
    return {
      activeMetric: null
    };
  },

  componentDidMount() {
    this.addSubscription(
      metricsStore.activeMetric
        .subscribe(activeMetric => this.setState({activeMetric}))
    );
  },

  getMetricsToShow(root, level) {
    const children = root.get('children');
    const label = root.get('label');

    if (!children) {
      return <MetricTreeLeaf key={label} metricObject={root} />;
    }

    return (
      <MetricTree key={label} header={{text: label, level}}>
        {root.get('children').map(child => this.getMetricsToShow(child, level + 1))}
      </MetricTree>
    );
  },

  render() {
    return (
      <div className={block}>

        <ListHeader header={'Metrics'}/>

        <ResetButton onClick={() => metricsStore.activeMetric.emit(null)} />

        {metricTree.get('children').map(child => this.getMetricsToShow(child, 0))}

      </div>
    );
  }
});

export default Metrics;
