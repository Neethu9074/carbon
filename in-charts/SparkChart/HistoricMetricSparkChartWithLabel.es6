import rpt from 'prop-types';
import React from 'react';

import HistoricMetricSparkChart from 'in-charts/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';

import './HistoricMetricSparkChartWithLabel.less';

const block = 'in-spark-chart-with-label';

export default class extends React.PureComponent {
  static displayName = 'HistoricMetricSparkChartWithLabel';

  static propTypes = {
    snapshotId: rpt.string.isRequired,
    metric: rpt.string.isRequired,
    formatter: rpt.func,
    design: rpt.string
  };

  render() {
    return (
      <div className={block}>
        <MetricValue
          snapshotId={this.props.snapshotId}
          metric={this.props.metric}
          formatter={this.props.formatter}
          className={block + '__value'}
        />
        <HistoricMetricSparkChart
          {...this.props}
          design={this.props.design}
          className={block + '__chart'}
          tooltipFormatter={this.props.formatter}
        />
      </div>
    );
  }
}
