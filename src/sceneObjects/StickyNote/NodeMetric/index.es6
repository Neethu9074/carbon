'use strict';

import React from 'react/addons';
import {activeMetric} from 'instana-ui-services/stores/metrics';
import {subscribeToMetric} from '../../../metricUtils';
import {getFormattedValue} from 'instana-ui-sdk/metrics';

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

      this.disposeRxo(this.metricSubscription);

      const metrics = metric.get('metrics');
      this.metricSubscription = subscribeToMetric({
        metrics, snapshot: this.props.snapshot, fn: ( values) => {
          values = values.map((v, index) => {
            return getFormattedValue(metrics.getIn([index, 'name']), v);
          });
          this.setState({values: values.slice()});
        }
      });
    });
  },

  componentWillUnmount() {
    this.disposeRxo(this.activeMetricSubscriptions);
    this.disposeRxo(this.metricSubscription);
  },

  disposeRxo(rxo) {
    if(rxo) {
      rxo.dispose();
    }
  },

  render() {
    const values = this.state.values;
    return (
      <div className='in-sticky-note__metric'>
        {values ? values.join(',') : null}
      </div>
    );
  }
});
