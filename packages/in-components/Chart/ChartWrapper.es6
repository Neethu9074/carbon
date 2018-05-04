import React from 'react';

import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import ChartWrapperPresenter from 'in-components/Chart/ChartWrapperPresenter';
import getMetrics from 'in-subscription/application/getMetrics';
import { deepCopy } from 'in-services/util/object';
import connectTo from 'in-hoc/connectTo';
import invariant from 'invariant';

// Sample Usage
/*
<ChartWrapper
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.countErrorBar,
              labels: ['Calls', 'Errors'],
              metricIds: ['calls', 'errors']  <-- theses ids will be referenced in the metricsConfiguration down below
            }}
            y2={{
              renderer: Renderer.line,
              labels: ['Latency'],
              colors: ['#57a7f0'],
              formatter: millis,
              metricIds: ['latency']
            }}
            metricsConfiguration={{
              filter: {
                timeConfig,
                endpointType: data.type,
                endpoint: data.id,
                application: applicationId,
                service: serviceId
              },
              metrics: {
                calls: {
                  metric: 'calls',
                  granularity: 60000,
                  aggregation: 'SUM'
                },
                errors: {
                  metric: 'errors',
                  granularity: 60000,
                  aggregation: 'SUM'
                },
                latency: {
                  metric: 'latency',
                  granularity: 60000,
                  aggregation: 'SUM'
                }
              }
            }}
          />
 */
export default connectTo(
  props => ({
    result: getMetrics(props.metricsConfiguration)
  }),
  function ChartWrapper({ result, ...props }) {
    return <ChartWrapperPresenter result={result} config={wrapProps(result, props)} />;
  }
);

function wrapProps(result, props) {
  if (__DEV__) {
    props.y1.metricIds.forEach(id => {
      invariant(Object.keys(props.metricsConfiguration.metrics).indexOf(id) !== -1, `Metric id ${id} not found.`);
    });

    if (props.y2 != null) {
      props.y2.metricIds.forEach(id => {
        invariant(Object.keys(props.metricsConfiguration.metrics).indexOf(id) !== -1, `Metric id ${id} not found.`);
      });
    }

    const keys = props.metricsConfiguration.metrics;
    for (let i = 1; i < keys.length; i++) {
      if (this[i] !== this[0]) {
        invariant(false, 'All aggregation types for one axis must have the same value.');
        break;
      }
    }
  }

  if (result.errors.length > 0 || result.progress.loading) {
    return {
      cardTitle: props.cardTitle
    };
  }

  const propsClone = deepCopy(props);

  propsClone.timeConfig = getResolvedTimeConfig(propsClone.timeConfig, result);
  propsClone.granularity = getChartGranularity(propsClone.timeConfig);

  propsClone.y1.metrics = propsClone.y1.metricIds.map(id => result.data[id]);
  propsClone.y1.aggregations = propsClone.y1.metricIds.map(id => props.metricsConfiguration.metrics[id].aggregation);

  if (propsClone.y2 != null) {
    propsClone.y2.metrics = propsClone.y2.metricIds.map(id => result.data[id]);
    propsClone.y2.aggregations = propsClone.y2.metricIds.map(id => props.metricsConfiguration.metrics[id].aggregation);
  }

  return propsClone;
}
