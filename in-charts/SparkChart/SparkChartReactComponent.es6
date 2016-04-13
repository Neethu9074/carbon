import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import React from 'react';

import createSparkChart from 'in-charts/SparkChart/SparkChart';
import * as timelineStore from 'in-stores/timeline';

const rpt = React.PropTypes;
const block = 'in-spark-chart';

export default React.createClass({
  displayName: 'SparkChart',

  mixins: [PureRenderMixin],

  propTypes: {
    width: rpt.number.isRequired,
    height: rpt.number.isRequired,
    datasource: rpt.object.isRequired,
    timeframe: timelineStore.timeframeShape.isRequired
  },

  componentDidMount() {
    this.initCharts(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.initCharts(nextProps);
  },

  initCharts(props) {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }

    this.chart = createSparkChart({
      width: props.width,
      height: props.height,
      datasource: props.datasource,
      container: ReactDOM.findDOMNode(this),
      timeframe: props.timeframe
    });
  },

  render() {
    return (
      <div className={block} />
    );
  }
});
