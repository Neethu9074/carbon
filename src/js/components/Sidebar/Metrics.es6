'use strict';

import React from 'react/addons';
import Immutable from 'immutable';

import Icon from 'instana-ui-components/Icon';
import * as metricsStore from 'instana-ui-services/stores/metrics';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';

import './Metrics.less';

const block = 'in-sidebar-metrics';

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
          metrics: ['load.1min']
        },
        {
          icon: 'metrics_cpu_usage',
          label: 'Usage',
          longLabel: 'CPU Usage',
          metrics: [
            'cpu.total.user',
            'cpu.total.sys',
            'cpu.total.wait',
            'cpu.total.nice',
            'cpu.total.steal'
          ]
        }
      ]
    },
    {
      icon: 'metrics_memory',
      label: 'Memory',
      longLabel: 'Memory free',
      metrics: ['memory.free']
    },
    {
      icon: 'metrics_network',
      label: 'Network',
      longLabel: 'Network XYZ'
    },
    {
      icon: 'metrics_disc',
      label: 'Filesystem',
      longLabel: 'Disc Usage'
    }
  ]
});

const Metrics = React.createClass({
  mixins: [SubscriptionMixin],

  getInitialState() {
    return {
      path: Immutable.List()
    };
  },

  componentDidMount() {
    this.addSubscription(
      metricsStore.metricPath.subscribe(path => this.setState({path}))
    );
  },

  render() {
    return (
      <div className={block}>

        {!this.state.path.isEmpty() ?
          <div className={block + '__navigation'}>
            <Icon type='arrow_left'
                  onClick={this.onBack}
                  className={block + '__back'}/>
            {this.getCurrentlyActiveItem().get('label')}
          </div>
        : null}

        <ul className={block + '__metric-list'}>
          {this.getMetricsToShow().map(metricConfig =>
            <li key={metricConfig.get('label')}
                className={block + '__metric-list-item'}
                onClick={this.onClickMetric.bind(this, metricConfig)}>
              <Icon type={metricConfig.get('icon')}
                    className={block + '__icon'}/>
              <span className={block + '__label'}>
                {metricConfig.get('label')}
              </span>
            </li>
          ).toJS()}
        </ul>

      </div>
    );
  },

  getMetricsToShow() {
    if (this.state.path.isEmpty()) {
      return metricTree.get('children');
    }

    const activeItem = this.getCurrentlyActiveItem();
    // if currently active item has no children, use the parent
    if (!activeItem.has('children')) {
      return this.state.path.get(this.state.path.size - 2).get('children');
    }

    return activeItem.get('children');
  },

  getCurrentlyActiveItem() {
    return this.state.path.last();
  },

  onClickMetric(metricConfig) {
    if (metricConfig.has('children')) {
      metricsStore.setMetricPath(this.state.path.push(metricConfig));
    } else if (metricConfig.has('metrics')) {
      metricsStore.setActiveMetric(metricConfig);
    }
  },

  onBack() {
    metricsStore.setMetricPath(this.state.path.pop());
  }

});

export default Metrics;
