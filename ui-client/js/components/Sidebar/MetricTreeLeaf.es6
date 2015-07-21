'use strict';

import React from 'react/addons';
import * as metricsStore from 'instana-ui-services/stores/metrics';

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
    metricsStore.setActiveMetric(this.props.metricObject);
  },

  render() {
    let classes = this.props.className ?
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
