import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {activeMetric$, setActiveMetric} from 'in-stores/metric';

import './MetricTreeLeaf.less';

const block = 'in-sidebar-metric-tree--leaf';
const rpt = React.PropTypes;

const MetricTreeLeaf = React.createClass({
  mixins: [
    PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    metricObject: rpt.object.isRequired,
    style: rpt.object
  },

  getInitialState() {
    return { activeMetric: '' };
  },

  componentDidMount() {
    this.addSubscription(activeMetric$.subscribe(activeMetric => this.setState({ activeMetric })));
  },

  onClickMetric() {
    setActiveMetric(this.props.metricObject);
  },

  render() {
    const isActive = this.state.activeMetric === this.props.metricObject;
    const className = isActive ?
     block + '__active ' + block
     : block;

    return (
      <div className={className}
           style={this.props.style}
           onClick={this.onClickMetric}>
        {this.props.metricObject.get('label')}
      </div>
    );
  }
});

export default MetricTreeLeaf;
