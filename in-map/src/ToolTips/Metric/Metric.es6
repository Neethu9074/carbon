import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import MetricTooltip from 'in-components/Tooltips/Metric';
import {activeMetric} from 'in-services/stores/metrics';
import {getFormattedValue} from 'in-sdk/metrics';

import {subscribeToMetric} from '../../metricUtils';
import Tooltip from '../Tooltip';


const MetricRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshotId: React.PropTypes.number.isRequired
  },

  getInitialState() {
    return {values: [], metrics: []};
  },

  componentDidMount() {
    this.addSubscription(activeMetric.subscribe(metric => {
      if (!metric) {
        return;
      }
      const metrics = metric.get('metrics');
      this.setState({metrics});

      this.addSubscription(subscribeToMetric({
        metrics,
        id: this.props.snapshotId,
        fn: values => this.setState({values: values.slice()})
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
      return getFormattedValue(metricName, this.props.snapshotId, value[1]);
    });

    return (
      <MetricTooltip metrics={metrics} values={values}/>
    );
  }
});


export default class TooltipMetric extends Tooltip {
  constructor(parent) {
    super(parent);
  }

  render() {
    React.render(
      <MetricRC snapshotId={this.parent.id} />,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
