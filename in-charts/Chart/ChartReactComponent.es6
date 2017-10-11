import { isEqual } from 'lodash';
import React from 'react';

import createDataSeriesFilterStore from 'in-charts/dataseriesFilterStore';
import { number, percentage } from 'in-services/formatters/number';
import ChartLegend from 'in-components/Chart/components/Legend';
import createChart from 'in-charts/Chart/Chart';

export default class extends React.Component {
  static displayName = 'ChartReactComponent';

  filterStore = createDataSeriesFilterStore();

  static defaultProps = {
    height: 150
  };

  constructor(props) {
    super(props);
    this.state = {
      chartProps: processChartProps(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      chartProps: processChartProps(nextProps)
    });
  }

  componentDidMount() {
    this.renderChart();
  }

  renderChart() {
    // Copy all props to separate chart config object from React lifecycle and prop immutability.
    const props = this.state.chartProps;
    const config = {
      height: props.height,
      minRollup: props.minRollup,
      margins: props.margins,
      avoidMarginOverrides: props.avoidMarginOverrides,
      timeframe$: props.timeframe$,
      snapshotId: props.snapshotId,
      snapshotIds: props.snapshotIds,
      withoutAxis: props.withoutAxis,
      withoutLegend: props.withoutLegend,
      y1: props.y1,
      y2: props.y2,
      activeFilters$: props.activeFilters$,
      eventEmitter: this.eventEmitter
    };
    config.container = this.container;
    config.filterStore = this.filterStore;
    this.chart = createChart(config);
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.snapshotId !== nextProps.snapshotId ||
      !isEqual(this.props.snapshotIds, nextProps.snapshotIds) ||
      this.props.timeframe$ !== nextProps.timeframe$ ||
      this.props.withoutAxis !== nextProps.withoutAxis ||
      this.props.withoutLegend !== nextProps.withoutLegend ||
      !this.isAxisEqual(this.props.y1, nextProps.y1) ||
      !this.isAxisEqual(this.props.y2, nextProps.y2)
    );
  }

  isAxisEqual(currentAxis, nextAxis) {
    if (currentAxis == null && nextAxis == null) {
      return true;
    }
    if (currentAxis != null && nextAxis == null) {
      return false;
    }
    if (currentAxis == null && nextAxis != null) {
      return false;
    }
    return isEqual(currentAxis.labels, nextAxis.labels) && isEqual(currentAxis.metrics, nextAxis.metrics);
  }

  componentDidUpdate() {
    this.dispose();
    this.renderChart();
  }

  componentWillUnmount() {
    this.dispose();
  }

  dispose() {
    if (this.chart) {
      this.filterStore = createDataSeriesFilterStore();
      this.chart.dispose();
      this.chart = null;
    }
  }

  render() {
    return (
      <div ref={container => (this.container = container)}>
        {!this.props.withoutLegend && <ChartLegend {...this.state.chartProps} filterStore={this.filterStore} />}
      </div>
    );
  }
}

function processChartProps(props) {
  if (props.y1) {
    processAxis(props.y1);
  }
  if (props.y2) {
    processAxis(props.y2);
  }
  return props;
}

function processAxis(axis) {
  if (axis.type === 'countErrorBar') {
    axis.colors = ['#5da6da', '#d03035'];
    axis.aggregation = ['sum', 'mean'];
    axis.formatter = [number.compact, percentage.compact];
    axis.tooltipFormatter = [number.compact, percentage.detailed];
  }

  if (axis.maxDataPoints && axis.minPixelPerBlock && axis.aggregation == null) {
    if (__DEV__) {
      throw new Error('no aggregation defined for aggregated chart');
    }
    axis.aggregation = 'sum';
  }

  if (typeof axis.aggregation === 'string') {
    const aggregationArray = [];
    for (let i = 0, len = axis.metrics.length; i < len; i++) {
      aggregationArray[i] = axis.aggregation;
    }
    axis.aggregation = aggregationArray;
  }

  if (axis.aggregation instanceof Array) {
    let isHomogeneousAggregation = true;
    const firstAggregation = axis.aggregation[0];
    for (let i = 1; i < axis.aggregation.length && isHomogeneousAggregation; i++) {
      isHomogeneousAggregation = axis.aggregation[i] === firstAggregation;
    }
    axis.isHomogeneousAggregation = isHomogeneousAggregation;
  }

  if (!(axis.formatter instanceof Array)) {
    const formatterArray = [];
    for (let i = 0, len = axis.metrics.length; i < len; i++) {
      formatterArray[i] = axis.formatter;
    }
    axis.formatter = formatterArray;
  }

  if (!(axis.tooltipFormatter instanceof Array)) {
    const tooltipFormatterArray = [];
    for (let i = 0, len = axis.metrics.length; i < len; i++) {
      tooltipFormatterArray[i] = axis.tooltipFormatter;
    }
    axis.tooltipFormatter = tooltipFormatterArray;
  }
}
