import React from 'react/addons';

import * as metricsStore from 'in-services/stores/metrics';
import * as tracking from 'in-services/tracking';

import './MetricTreeLeaf.less';

const block = 'in-sidebar-metric-tree--leaf';
const rpt = React.PropTypes;
const MetricTreeLeaf = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    metricObject: rpt.object.isRequired,
    style: rpt.object,
    className: rpt.string
  },

  onClickMetric() {
    tracking.trackEvent(tracking.events.showMetricIn3dMap);
    metricsStore.setActiveMetric(this.props.metricObject);
  },

  render() {
    const classes = this.props.className ?
      block + ' ' + this.props.className :
      block;

    return (
      <div className={classes}
           style={this.props.style}
           onClick={this.onClickMetric}>
        {this.props.metricObject.get('label')}
      </div>
    );
  }
});

export default MetricTreeLeaf;
