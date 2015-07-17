'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';
import MetricTooltip from 'instana-ui-components/Tooltips/Metric';

import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {activeMetric} from 'instana-ui-services/stores/metrics';
import {subscribeToMetric} from '../../../metricUtils';
import {getFormattedValue} from 'instana-ui-sdk/metrics';


/*eslint-disable no-unused-vars*/
const MetricRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {values: [], metrics: []};
  },

  componentDidMount() {
    this.addSubscription(activeMetric.subscribe(metric => {
      if(!metric) {
        return;
      }
      const metrics = metric.get('metrics');
      this.setState({metrics});

      this.addSubscription(subscribeToMetric({
        metrics, snapshot: this.props.snapshot, fn: (values) => {
          this.setState({values: values.slice()});
        }
      }));
    }));
  },

  render() {
    const metrics = this.state.metrics.slice().reverse();
    const values = this.state.values
    .slice()
    .reverse()
    .map((value, index) => {
      const metricName = metrics.getIn([index, 'name']);
      return getFormattedValue(metricName, this.props.snapshot, value);
    });

    return (
      <MetricTooltip metrics={metrics} values={values}/>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class TooltipMetric extends Tooltip {
  constructor(parent) {
    super(parent);
    this.render();
  }

  render() {
    React.render(
      <MetricRC
        snapshot={this.parent.snapshot}
      />,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
