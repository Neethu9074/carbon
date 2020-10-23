import { get } from 'lodash';
import React from 'react';

import ErroneousServiceInformation from 'in-applications/ApplicationMap/components/Tooltips/ServiceInformation/ErroneousServiceInformation';
import ApplicationMapTootlip from 'in-applications/ApplicationMap/components/Tooltips/ApplicationMapTootlip';
import Header from 'in-applications/ApplicationMap/components/Tooltips/ServiceInformation/Header';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { number, percentage, meanLatency } from 'in-services/formatters/number';
import SparkChart from 'in-components/SparkChart';

import locals from './ServiceInformation.mless';

export default function ServiceInformation(props) {
  const { service, metricsResult } = props;
  const isLoading = get(metricsResult, ['progress', 'loading'], false);
  const hasErrors = metricsResult.errors.length > 0;
  let content;
  if (hasErrors) {
    content = <ErroneousServiceInformation service={service} errors={metricsResult.errors} />;
  } else if (isLoading) {
    content = <DefaultServiceInformation {...props} />;
  } else {
    content = <DefaultServiceInformation {...props} />;
  }

  return content;
}

function DefaultServiceInformation({ service, timeConfig, metricsResult }) {
  const resolvedTimeConfig = metricsResult ? getResolvedTimeConfig(timeConfig, metricsResult) : null;
  const rollup = getSparkChartGranularity(timeConfig);

  return (
    <ApplicationMapTootlip
      renderHeader={() => <Header service={service} />}
      renderContent={() => (
        <div className={locals.sparkCharts}>
          <SparkChartWithMetric
            title="Total Calls"
            rollup={rollup}
            timeConfig={resolvedTimeConfig}
            aggregation="SUM"
            metrics={get(metricsResult, ['data', 'calls'])}
            metric={get(metricsResult, ['data', 'callsAgg'])}
            tooltipFormatter={number.compact}
          />
          <SparkChartWithMetric
            title="Erroneous Calls"
            rollup={rollup}
            timeConfig={resolvedTimeConfig}
            aggregation="MEAN"
            metrics={get(metricsResult, ['data', 'errors'])}
            metric={get(metricsResult, ['data', 'errorsAgg'])}
            tooltipFormatter={percentage.compact}
          />
          <SparkChartWithMetric
            title="Avg. Latency"
            rollup={rollup}
            timeConfig={resolvedTimeConfig}
            aggregation="MEAN"
            metrics={get(metricsResult, ['data', 'latency'])}
            metric={get(metricsResult, ['data', 'latencyAgg'])}
            tooltipFormatter={meanLatency.detailed}
          />
        </div>
      )}
    />
  );
}

function SparkChartWithMetric(props) {
  const { metric, tooltipFormatter, title } = props;
  return (
    <div>
      <h3 className={locals.sparkChartLabel}>{title}</h3>
      <SparkChart
        {...props}
        verticalMetricValue={metric && metric.length > 0 ? tooltipFormatter(metric[0][1]) : null}
      />
    </div>
  );
}
