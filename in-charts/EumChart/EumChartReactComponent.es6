import React from 'react';

import createDataSeriesFilterStore from 'in-charts/dataseriesFilterStore';
import createChart from 'in-charts/EumChart/EumChart';

export default class extends React.Component {
  static displayName = 'EumChartReactComponent';

  filterStore = createDataSeriesFilterStore();

  static defaultProps = {
    height: 60
  };

  componentDidMount() {
    this.renderChart();
  }

  renderChart = () => {
    // Copy all props to separate chart config object from React lifecycle and prop immutability.
    const props = this.props;
    const config = {
      height: props.height,
      y1: props.y1,
      y2: props.y2,
      timeframe$: props.timeframe$,
      snapshotId: props.snapshotId,
      dynamicRollupAggregation: props.dynamicRollupAggregation
    };
    config.container = this.container;
    config.filterStore = this.filterStore;
    this.chart = createChart(config);
  };

  shouldComponentUpdate(nextProps) {
    return this.props.snapshotId !== nextProps.snapshotId || this.props.timeframe$ !== nextProps.timeframe$;
  }

  componentDidUpdate() {
    this.dispose();
    this.renderChart();
  }

  componentWillUnmount() {
    this.dispose();
  }

  dispose = () => {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  };

  render() {
    return <div ref={container => (this.container = container)} />;
  }
}
