'use strict';

import React from 'react/addons';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import {create} from 'instana-ui-services/conveyer';
import {activeMetric} from 'instana-ui-services/stores/metrics';
// import {combineLatest} from 'reactive-observables';

import './index.less';

const rpt = React.PropTypes;
export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  getInitialState() {
    return {value: 42};
  },

  componentDidMount() {
    this.activeMetricSubscriptions = activeMetric.subscribe(metric => {
      if(!metric) {
        return;
      }
      const metrics = metric.get('metrics');
      this.disposeRxo(this.metricSubscription);

      if(metrics.size === 1) {
        this.subscribeToSingle(metrics.get(0));
      } else {
        // this.subscribeToMulti(metrics);
      }
    });
  },

  componentWillUnmount() {
    this.disposeRxo(this.activeMetricSubscriptions);
    this.disposeRxo(this.metricSubscription);
  },

  subscribeToSingle(metric) {
    this.metricSubscription = this.createSingleMetricSource(metric)
    .subscribe((value) => {this.setState({value}); });
  },

  createSingleMetricSource(metric) {
    return create(MetricConveyer, {
      metric, frequency: 1000, snapshot: this.props.snapshot
    });
  },

  disposeRxo(rxo) {
    if(rxo) {
      rxo.dispose();
    }
  },

  render() {
    return (
      <div className='in-sticky-note__metric'>
        {this.state.value}
      </div>
    );
  }
});
