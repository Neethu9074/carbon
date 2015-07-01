'use strict';

import React from 'react/addons';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {activeMetric} from 'instana-ui-services/stores/metrics';
import {subscribeToMetric} from '../../../metricUtils';
import {getFormattedValue} from 'instana-ui-sdk/metrics';

import './index.less';

const rpt = React.PropTypes;
export default React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  getInitialState() {
    return {value: 42};
  },

  componentDidMount() {
    this.addSubscription(activeMetric.subscribe(metric => {
      if(!metric) {
        return;
      }

      const metrics = metric.get('metrics');
      if(this.metricSub) {
        this.metricSub.dispose();
      }
      this.metricSub = subscribeToMetric({
        metrics, snapshot: this.props.snapshot, fn: ( values) => {
          values = values.map((v, index) => {
            return getFormattedValue(
              metrics.getIn([index, 'name']),
              this.props.snapshot,
              v);
          });
          this.setState({values: values.slice()});
        }
      });
    }));
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
