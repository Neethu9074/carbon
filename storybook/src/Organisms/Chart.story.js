/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { withKnobs, number } from '@storybook/addon-knobs';

import AlertingRenderer from 'in-alerting/components/Chart/renderer/Renderer';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { percentage } from 'in-services/formatters/number';
import { compare } from 'in-services/util/number';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { minutes } from 'in-services/time';
import theme from 'in-themes';

const oneSecond = 1000;
const oneMinute = oneSecond * 60;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;
const now = Date.now(); // TODO: use fixed time (part of https://instana.kanbanize.com/ctrl_board/59/cards/20424)

export default {
  title: 'Organisms|Chart',
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  decorators: [withKnobs],
  component: ResultAwareChart
};

export function MissingData() {
  return (
    <>
      <ResultAwareChart config={{}} data={{}} result={{ errors: [], progress: { loading: false } }} />
    </>
  );
}

export function Loading() {
  return (
    <>
      <ResultAwareChart
        config={{}}
        data={{}}
        result={{
          errors: [],
          progress: {
            loading: true,
            percentage: number('percentage', 0.5, { range: true, min: 0, max: 1, step: 0.05 })
          }
        }}
      />
    </>
  );
}

export function MissingDataWithoutTextInfo() {
  return (
    <ResultAwareChart
      config={{
        timeConfig: generateTimeframe(oneHour),
        showNoDataInfoWhenEmpty: false,
        y1: {
          renderer: Renderer.line,
          labels: ['Calls'],
          metricIds: [],
          metrics: [generateMetrics(0, 20, oneHour)]
        }
      }}
      data={{}}
      result={{ errors: [], progress: { loading: false } }}
    />
  );
}

export function Simple() {
  const timeframe = generateTimeframe(oneHour);
  const granularity = getChartGranularity(timeframe);

  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          granularity,
          timeConfig: timeframe,
          y1: {
            renderer: Renderer.line,
            labels: ['Calls'],
            metricIds: [],
            metrics: [generateMetrics(60, 20, oneHour)]
          }
        }}
      />
      {false && (
        <ResultAwareChart
          result={constructResult(null, false)}
          config={{
            granularity,
            timeConfig: timeframe,
            y1: {
              renderer: Renderer.line,
              labels: ['Calls'],
              metricIds: [],
              metrics: [generateMetrics(200, 20, oneHour)]
            }
          }}
        />
      )}
    </>
  );
}

export function States() {
  return (
    <>
      <ResultAwareChart result={constructResult('Some error happened.', false)} config={{}} />
      <br />
      <ResultAwareChart result={constructResult(null, true)} config={{}} />
    </>
  );
}

export function MultipleSeries() {
  const timeframe = generateTimeframe(oneMinute);
  const granularity = getChartGranularity(timeframe);

  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          granularity,
          timeConfig: timeframe,
          y1: {
            renderer: Renderer.line,
            labels: ['Calls', 'Count'],
            metricIds: [],
            metrics: [generateMetrics(60, 5, oneMinute), generateMetrics(60, 5, oneMinute)]
          }
        }}
      />
    </>
  );
}

export function LongSeriesLabels() {
  const timeframe = generateTimeframe(oneMinute);
  const granularity = getChartGranularity(timeframe);

  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          granularity,
          timeConfig: timeframe,
          renderLegend: false,
          y1: {
            renderer: Renderer.line,
            labels: [
              'ThisOneUsesLineWrap > ThisOneUsesLineWrap',
              'ThisOneIsJustWayToLongToFitIntoThisTinyTooltip',
              'ThisOneUsesLineWrap > ButThisOneIsJustWayToLongToFitIntoThisTinyTooltip'
            ],
            metricIds: [],
            metrics: [
              generateMetrics(60, 5, oneMinute),
              generateMetrics(60, 5, oneMinute),
              generateMetrics(60, 5, oneMinute)
            ]
          }
        }}
      />
    </>
  );
}

export function DualAxis() {
  const timeframe = generateTimeframe(oneMinute);
  const granularity = getChartGranularity(timeframe);

  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          granularity,
          timeConfig: timeframe,
          y1: {
            renderer: Renderer.line,
            labels: ['Calls', 'Count'],
            metricIds: [],
            metrics: [generateMetrics(60, 10, oneMinute), generateMetrics(60, 5, oneMinute)]
          },
          y2: {
            renderer: Renderer.line,
            labels: ['Latency'],
            metricIds: [],
            metrics: [generateMetrics(60, 1, oneMinute)],
            formatter: percentage
          }
        }}
      />
    </>
  );
}

export function DualAxisDifferentMetricCount() {
  const timeframe = generateTimeframe(oneMinute);
  const granularity = getChartGranularity(timeframe);

  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          granularity,
          timeConfig: timeframe,
          y1: {
            renderer: Renderer.line,
            labels: ['Calls', 'Count'],
            metricIds: [],
            metrics: [generateMetrics(60, 10, oneMinute), generateMetrics(40, 5, oneMinute)]
          },
          y2: {
            renderer: Renderer.line,
            labels: ['Latency'],
            metricIds: [],
            metrics: [generateMetrics(30, 1, oneMinute)],
            formatter: percentage
          }
        }}
      />
    </>
  );
}

export function Gaps() {
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.line,
            labels: ['Calls'],
            metricIds: [],
            metrics: [generateMetricsWithGaps(30, 10, oneMinute)]
          }
        }}
      />
    </>
  );
}

export function Bar() {
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.bar,
            labels: ['Calls'],
            metricIds: [],
            metrics: [generateMetrics(12, 100, oneMinute)],
            aggregation: 'awesomeAggregation'
          }
        }}
      />
    </>
  );
}

const metricsBarWithThreshold = [generateMetrics(12, 100, oneMinute)];
export function BarWithThreshold() {
  const [threshold, setThreshold] = useState(32);
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          operator: '>=',
          y1: {
            threshold,
            getMax: metricsMaxValue => {
              return threshold >= metricsMaxValue ? Math.max(metricsMaxValue, threshold * 1.2) : metricsMaxValue;
            },
            colors: [
              theme.lib.colors.blue800,
              theme.lib.colors.red800,
              theme.lib.colors.lightBlue800,
              theme.lib.colors.pink800
            ],
            renderer: AlertingRenderer.lineWithThreshold,
            metricIds: [],
            metrics: metricsBarWithThreshold,
            labels: ['Data']
          }
        }}
      />
      <FormGroup>
        <Label>Threshold</Label>
        <Input
          type="number"
          min={0}
          name="threshold"
          value={threshold}
          onChange={e => setThreshold(Number(e && e.target.value))}
        />
      </FormGroup>
    </>
  );
}

const metricsBarWithBaseline = [generateMetrics(144, 100, oneDay)];
const baselineBarWithBaseline = generateBaselineForMetric(metricsBarWithBaseline[0], 10 * oneMinute, 2.0, 10.0, 3.0);
export function BarWithBaseline() {
  const [sensitivity, setSensitivity] = useState(1.0);
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneDay),
          granularity: 10 * oneMinute,
          y1: {
            sensitivity,
            getMax: metricsMaxValue => {
              return metricsMaxValue; // TODO include sensitivity and baseline as well, not just the max-metric-value
            },
            colors: [
              theme.lib.colors.blue800,
              theme.lib.colors.red800,
              theme.lib.colors.lightBlue800,
              theme.lib.colors.pink800
            ],
            renderer: AlertingRenderer.lineWithBaseline,
            metricIds: [],
            metrics: metricsBarWithBaseline,
            baseline: baselineBarWithBaseline,
            operator: '>=',
            labels: ['Data'],
            thresholdGranularity: minutes.toMillis(10)
          }
        }}
      />
      <FormGroup>
        <Label>Sensitivity</Label>
        <Input
          type="number"
          min={0}
          step={0.01}
          name="sensitivity"
          value={sensitivity}
          onChange={e => setSensitivity(Number(e && e.target.value))}
        />
      </FormGroup>
    </>
  );
}

export function Area() {
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.area,
            labels: ['Calls', 'Count'],
            metricIds: [],
            metrics: [generateMetrics(30, 10, oneMinute), generateMetricsWithGaps(30, 10, oneMinute)]
          }
        }}
      />
    </>
  );
}

export function StackedArea() {
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedArea,
            labels: ['foo', 'bar', 'baz'],
            metricIds: [],
            metrics: generateMultipleMetrics(3, 30, 10, oneMinute)
          }
        }}
      />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedArea,
            labels: ['1', '2', '3', '4', '5'],
            metricIds: [],
            metrics: generateMultipleMetricsWithGaps(5, 30, 10, oneMinute)
          }
        }}
      />
    </>
  );
}

export function Pie() {
  return (
    <>
      <TooltipPresenter />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.pie,
            labels: ['foo', 'bar', 'baz'],
            metricIds: [],
            metrics: generateMultipleMetrics(3, 30, 10, oneMinute),

            colors: ['#ff0000', '#00ff00', '#0000ff'],
            formatter: x => x
          }
        }}
      />
    </>
  );
}

export function StackedBar() {
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedBar,
            labels: ['foo', 'bar', 'baz'],
            metricIds: [],
            metrics: generateMultipleMetrics(3, 30, 10, oneMinute)
          }
        }}
      />
    </>
  );
}

export function Integral() {
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.integral,
            labels: ['foo', 'bar', 'baz'],
            metricIds: [],
            metrics: generateMultipleMetrics(3, 100, 100, oneMinute)
          }
        }}
      />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.integral,
            labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
            metricIds: [],
            metrics: generateMultipleMetrics(8, 30, 10, oneMinute)
          }
        }}
      />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.integral,
            labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
            metricIds: [],
            metrics: generateMultipleMetricsWithGaps(8, 30, 10, oneMinute)
          }
        }}
      />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.integral,
            labels: ['min', '25th', '50th'],
            metricIds: [],
            metrics: (() => {
              let s1 = generateMetrics(40, 10, oneMinute);
              let s2 = generateMetrics(40, 10, oneMinute);
              let s3 = generateMetrics(40, 10, oneMinute);

              s1 = s1
                .slice(0, 5)
                .concat(s1.slice(10, 15))
                .concat(s1.slice(23, 25))
                .concat(s1.slice(27, 30));

              s2 = s2
                .slice(3, 7)
                .concat(s2.slice(17, 20))
                .concat(s2.slice(29, 38));

              s3 = s3.slice(12, 30);

              return [s1, s2, s3];
            })()
          }
        }}
      />
    </>
  );
}

export function MissingMetrics() {
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.line,
            labels: ['Metric A', 'Metric B'],
            metricIds: [],
            metrics: [generateMetrics(60, 20, oneMinute)]
          }
        }}
      />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedArea,
            labels: ['Metric A', 'Metric B', 'Metric C'],
            metricIds: [],
            metrics: [generateMetrics(60, 20, oneMinute), generateMetrics(60, 20, oneMinute)]
          }
        }}
      />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.integral,
            labels: ['Metric A', 'Metric B', 'Metric C'],
            metricIds: [],
            metrics: [generateMetrics(60, 20, oneMinute), generateMetrics(60, 20, oneMinute)]
          }
        }}
      />
    </>
  );
}

export function MissingDataPoint() {
  let dataSeries1 = generateMetrics(60, 20, oneMinute);
  dataSeries1[0] = undefined;
  dataSeries1[10] = undefined;
  dataSeries1[11] = undefined;
  dataSeries1[12] = undefined;
  dataSeries1[13] = undefined;
  dataSeries1[15] = undefined;
  dataSeries1[16] = undefined;
  dataSeries1[17] = undefined;
  dataSeries1[19] = undefined;
  dataSeries1[20] = undefined;

  const dataSeries2 = generateMetrics(60, 20, oneMinute);
  dataSeries2[10] = undefined;
  dataSeries2[21] = undefined;
  dataSeries2[dataSeries2.length - 1] = undefined;

  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.line,
            labels: ['Metric A', 'Metric B'],
            metricIds: [],
            metrics: [dataSeries1, dataSeries2]
          }
        }}
      />

      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.area,
            labels: ['Metric A', 'Metric B'],
            metricIds: [],
            metrics: [dataSeries1, dataSeries2]
          }
        }}
      />

      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.bar,
            labels: ['Metric A', 'Metric B'],
            metricIds: [],
            metrics: [dataSeries1, dataSeries2]
          }
        }}
      />

      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.barOverlapping,
            labels: ['Metric A', 'Metric B'],
            metricIds: [],
            metrics: [dataSeries1, dataSeries2]
          }
        }}
      />

      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.integral,
            labels: ['Metric A', 'Metric B'],
            metricIds: [],
            metrics: [dataSeries1, dataSeries2]
          }
        }}
      />

      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.point,
            labels: ['Metric A', 'Metric B'],
            metricIds: [],
            metrics: [dataSeries1, dataSeries2]
          }
        }}
      />

      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedArea,
            labels: ['Metric A', 'Metric B'],
            metricIds: [],
            metrics: [dataSeries1, dataSeries2]
          }
        }}
      />

      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedBar,
            labels: ['Metric A', 'Metric B'],
            metricIds: [],
            metrics: [dataSeries1, dataSeries2]
          }
        }}
      />

      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.line,
            labels: ['Metric A'],
            metricIds: [],
            metrics: [dataSeries1]
          }
        }}
      />
    </>
  );
}

export function SharedAxis() {
  return (
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        shareMaxAxisDomain: true,
        timeConfig: generateTimeframe(oneMinute),
        y1: {
          renderer: Renderer.line,
          labels: ['A', 'B'],
          metricIds: [],
          metrics: [generateMetrics(60, 10, oneMinute), generateMetrics(60, 5, oneMinute)]
        },
        y2: {
          renderer: Renderer.line,
          labels: ['C', 'D'],
          metricIds: [],
          metrics: [generateMetrics(60, 50, oneMinute), generateMetrics(60, 70, oneMinute)]
        }
      }}
    />
  );
}
export function WithCustomIconsInLegend() {
  return (
    <>
      <h2>Icons with defined chart colors</h2>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedBar,
            labels: ['foo', 'bar', 'baz'],
            icons: {
              types: ['lib_flame', 'lib_release_rocket', 'lib_linux']
            },
            metricIds: [],
            metrics: generateMultipleMetrics(3, 30, 10, oneMinute)
          }
        }}
      />
      <h2>Icons with custom colors</h2>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedBar,
            labels: ['foo', 'bar', 'baz'],
            icons: {
              types: ['lib_flame', 'lib_release_rocket', 'lib_linux'],
              colors: [theme.lib.colors.blue800, theme.lib.colors.pink800, theme.lib.colors.red800]
            },
            metricIds: [],
            metrics: generateMultipleMetrics(3, 30, 10, oneMinute)
          }
        }}
      />
    </>
  );
}

export function WithLegendAlignedToLeftSideOfChart() {
  return (
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        timeConfig: generateTimeframe(oneMinute),
        y1: {
          renderer: Renderer.stackedBar,
          labels: ['foo', 'bar', 'baz'],
          icons: {
            types: ['lib_flame', 'lib_release_rocket', 'lib_linux']
          },
          metricIds: [],
          metrics: generateMultipleMetrics(3, 30, 10, oneMinute)
        }
      }}
    />
  );
}

export function Points() {
  return (
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        timeConfig: generateTimeframe(oneMinute),
        y1: {
          renderer: Renderer.point,
          labels: ['Count'],
          metricIds: [],
          metrics: [generateMetrics(30, 4, oneMinute)]
        }
      }}
    />
  );
}

/* commented-out, because it fails with a strange error: 'this is undefined'
export const Resize = connectTo(
  () => {
    return {
      metricIds: [],
      metricIds: [],metrics: just(generateMetrics(20, 10, oneHour)),
      size: interval(1000)
        .map(() => ({ width: Math.max(200, Math.random() * 700) | 0, height: Math.max(60, (Math.random() * 200) | 0) }))
        .startWith({ width: 400, height: 150 })
    };
  },
  function Resize({ size, metrics }) {
    const timeframe = generateTimeframe(oneHour);

    return (
      <div style={{ width: size.width }}>
        <ResultAwareChart
          result={constructResult(null, false)}
          config={{
            customHeight: size.height,
            timeframe,
            y1: {
              renderer: Renderer.line,
              labels: ['Calls'],
              metricIds: [],
              metricIds: [],metrics: [metrics]
            }
          }}
        />
      </div>
    );
  }
);
 */

function generateMultipleMetricsWithGaps(numSeries, numMetrics, maxValue, windowSize) {
  const series = [];
  for (let i = 0; i < numSeries; i++) {
    series[i] = generateMetricsWithGaps(numMetrics, maxValue, windowSize);
  }
  return series;
}

function generateMultipleMetrics(numSeries, numMetrics, maxValue, windowSize) {
  const series = [];
  for (let i = 0; i < numSeries; i++) {
    series[i] = generateMetrics(numMetrics, maxValue, windowSize);
  }
  return series;
}

function generateMetricsWithGaps(numMetrics, maxValue, windowSize) {
  const metrics = generateMetrics(numMetrics, maxValue, windowSize);
  return metrics
    .slice(0, 5)
    .concat(metrics.slice(10, 15))
    .concat(metrics.slice(23, 25))
    .concat(metrics.slice(27, 30));
}

function generateMetrics(numMetrics, maxValue, windowSize) {
  const granularity = windowSize / numMetrics;
  const metrics = [];
  for (let i = numMetrics - 1; i >= 0; i--) {
    let timestamp = Math.floor((now - (i + 1) * (windowSize / numMetrics)) / granularity) * granularity;
    metrics[i] = [timestamp, ((Math.random() * maxValue * 100) | 0) / 100];
  }
  metrics.sort((a, b) => compare(a[0], b[0]));
  return metrics;
}

function generateBaselineForMetric(metric, granularity, maxBaselineNoise, deviation, maxDeviationNoise) {
  const to = metric[metric.length - 1][0];
  const windowSize = to - metric[0][0];
  const from = to - windowSize;
  const baselineLength = windowSize / granularity + 1;
  const baseline = [];
  const startIdx = Math.floor(from / granularity) % baselineLength;
  let idx = startIdx;
  for (let i = 0; i < baselineLength; ++i) {
    baseline[idx] = [
      idx * granularity,
      metric[i][1] + Math.random() * maxBaselineNoise,
      deviation + Math.random() * maxDeviationNoise
    ];
    idx = (idx + 1) % baselineLength;
  }
  return baseline;
}

function generateTimeframe(windowSize) {
  return {
    windowSize,
    to: now
  };
}

function constructResult(error, isLoading) {
  return {
    errors: error == null ? [] : [error],
    progress: {
      loading: isLoading
    }
  };
}
