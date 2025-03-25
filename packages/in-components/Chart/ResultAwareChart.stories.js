/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { themes } from '@instana/design-tokens';

import {
  createLineWithThreshold,
  createLineWithBaselineAndOptionalPotentialProblem
} from 'in-alerting/components/Chart/renderer/Renderer';
import { generateMetrics, fixedTimestamp, generateBaselineForMetric } from 'in-test/util/generateMetrics';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import { carbonAlert, outlineForColor } from 'in-themes/chartColors';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { percentage } from 'in-services/formatters/number';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

const oneSecond = 1000;
const oneMinute = oneSecond * 60;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;

export default {
  component: ResultAwareChart
};

export function MissingData() {
  return <ResultAwareChart config={{}} data={{}} result={constructResult(null, false)} />;
}

export function Loading() {
  return (
    <ResultAwareChart
      config={{ title: 'Loading chart', customHeight: '200px' }}
      data={{}}
      result={{
        errors: [],
        progress: {
          loading: true
        }
      }}
    />
  );
}

export function LoadingWithPercentage(props) {
  return (
    <ResultAwareChart
      config={{ title: 'Loading chart with percentage', customHeight: '200px' }}
      data={{}}
      result={{
        errors: [],
        progress: {
          loading: true,
          percentage: props.percentage
        }
      }}
    />
  );
}
LoadingWithPercentage.args = {
  percentage: 0.5
};
LoadingWithPercentage.argTypes = {
  percentage: { control: { type: 'range', min: 0, max: 1, step: 0.05 } }
};

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
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        title: 'Simple chart',
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
  );
}

export function ErrorState() {
  return (
    <ResultAwareChart result={constructResult('Some error happened.', false)} config={{ customHeight: '200px' }} />
  );
}

export function UnknownState() {
  return <ResultAwareChart result={constructResult(null, true)} config={{ customHeight: '200px' }} />;
}

export function MultipleSeries() {
  const timeframe = generateTimeframe(oneMinute);
  const granularity = getChartGranularity(timeframe);

  return (
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        title: 'Many time series',
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
  );
}

export function LongSeriesLabels() {
  const timeframe = generateTimeframe(oneMinute);
  const granularity = getChartGranularity(timeframe);

  return (
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        title: 'Chart with long series',
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
  );
}

export function DualAxis() {
  const timeframe = generateTimeframe(oneMinute);
  const granularity = getChartGranularity(timeframe);

  return (
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        title: 'Dual axis',
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
  );
}

export function DualAxisDifferentMetricCount() {
  const timeframe = generateTimeframe(oneMinute);
  const granularity = getChartGranularity(timeframe);

  return (
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        title: 'Dual axis with different metric count',
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
  );
}

export function Gaps() {
  return (
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        title: 'Gaps',
        timeConfig: generateTimeframe(oneMinute),
        y1: {
          renderer: Renderer.line,
          labels: ['Calls'],
          metricIds: [],
          metrics: [generateMetricsWithGaps(30, 10, oneMinute)]
        }
      }}
    />
  );
}

export function Bar() {
  return (
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        title: 'Bar',
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
  );
}
export function BarFirstNotClipped() {
  const timeConfig = generateTimeframe(oneMinute);
  const granularity = getChartGranularity(timeConfig);
  return (
    <ResultAwareChart
      result={constructResult(null, false)}
      config={{
        extendBar: true,
        granularity: granularity,
        title: 'Bar First Not Clipped',
        timeConfig: timeConfig,
        y1: {
          renderer: Renderer.bar,
          labels: ['Calls'],
          metricIds: [],
          metrics: [generateMetrics(12, 100, oneMinute)],
          aggregation: 'awesomeAggregation'
        }
      }}
    />
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
              themes.default.ids.color.option.blue['500'],
              themes.default.ids.color.option.red['500'],
              themes.default.ids.color.option.blue['400'],
              themes.default.ids.color.option.pink['500']
            ],
            renderer: createLineWithThreshold('>=', threshold),
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
const granularity = 10 * oneMinute;
const historicThreshold = {
  baseline: baselineBarWithBaseline,
  sensitivity: 2,
  deviationFactor: 2,
  operator: '>=',
  labels: ['Latency', 'Threshold', 'Violations'],
  thresholdGranularity: granularity
};
export function BarWithBaseline() {
  const [sensitivity, setSensitivity] = useState(1.0);
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneDay),
          granularity,
          y1: {
            sensitivity,
            getMax: metricsMaxValue => {
              return metricsMaxValue; // TODO include sensitivity and baseline as well, not just the max-metric-value
            },
            colors: [
              themes.default.ids.color.option.blue['500'],
              themes.default.ids.color.option.red['500'],
              themes.default.ids.color.option.blue['400'],
              themes.default.ids.color.option.pink['500']
            ],
            renderer: createLineWithBaselineAndOptionalPotentialProblem(historicThreshold, granularity),
            metricIds: [],
            metrics: metricsBarWithBaseline,
            labels: ['Data']
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
          title: 'extrapolateMissingMetrics: not set',
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedArea,
            labels: ['1', '2', '3', '4', '5'],
            metricIds: [],
            metrics: generateMultipleMetricsWithGaps(5, 30, 10, oneMinute, true)
          }
        }}
      />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          title: 'extrapolateMissingMetrics: true',
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedArea,
            labels: ['1', '2', '3', '4', '5'],
            metricIds: [],
            extrapolateMissingMetrics: true,
            metrics: generateMultipleMetricsWithGaps(5, 30, 10, oneMinute, true)
          }
        }}
      />
    </>
  );
}
export function StackedAreaNonUniformGaps() {
  const labels = ['blue', 'green', 'purple', 'red', 'other', 'another'];
  const twolabels = labels.slice(0, 2);
  const threelabels = labels.slice(0, 3);
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          title: 'Two lines, Extrapolate=false',
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedArea,
            labels: twolabels,
            metricIds: [],
            metrics: generateMultipleMetricsWithGaps(twolabels.length, 30, 10, oneMinute, true)
          }
        }}
      />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          title: 'Two lines, Extrapolate=true',
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedArea,
            labels: twolabels,
            metricIds: [],
            extrapolateMissingMetrics: true,
            metrics: generateMultipleMetricsWithGaps(twolabels.length, 30, 10, oneMinute, true)
          }
        }}
      />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          title: 'Three lines, Extrapolate=false',
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedArea,
            labels: threelabels,
            metricIds: [],
            metrics: generateMultipleMetricsWithGaps(threelabels.length, 30, 10, oneMinute, true)
          }
        }}
      />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          title: 'Three lines, Extrapolate=true',
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedArea,
            labels: threelabels,
            metricIds: [],
            extrapolateMissingMetrics: true,
            metrics: generateMultipleMetricsWithGaps(threelabels.length, 30, 10, oneMinute, true)
          }
        }}
      />
    </>
  );
}

export function LoadingPie() {
  return (
    <>
      <TooltipPresenter />
      <ResultAwareChart
        result={constructResult(null, true)}
        config={{
          title: 'Loading pie',
          customHeight: '200px',
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

export function Pie() {
  return (
    <>
      <TooltipPresenter />
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          title: 'Pie',
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
  );
}

export function StackedBarWithOutline() {
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig: generateTimeframe(oneMinute),
          y1: {
            renderer: Renderer.stackedBar,
            labels: ['foo', 'bar', 'baz'],
            outlineForColor: outlineForColor,
            colors: [carbonAlert.red60, carbonAlert.orange40, carbonAlert.yellow30],
            metricIds: [],
            metrics: generateMultipleMetrics(3, 30, 10, oneMinute)
          }
        }}
      />
      <p style={{ marginTop: '1rem' }}>
        Carbon Alert colors should use the outlineForColor parameter to enhance visibility.
      </p>
      <pre>
        {`
  y1: {
    ...
    outlineForColor: outlineForColor
  }`}
      </pre>
      <p>outlineForColor is defined as a map from primary colors to outline colors.</p>
      <pre>
        {`
  outlineForColor: {
    [carbonAlert.orange40]: carbonAlert.orange60,
    [carbonAlert.yellow30]: carbonAlert.yellow60
  }`}
      </pre>
      <p>so that carbonAlert.orange40, for example, is outlined with carbonAlert.orange60.</p>
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

              s1 = s1.slice(0, 5).concat(s1.slice(10, 15)).concat(s1.slice(23, 25)).concat(s1.slice(27, 30));

              s2 = s2.slice(3, 7).concat(s2.slice(17, 20)).concat(s2.slice(29, 38));

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
              colors: [
                themes.default.ids.color.option.blue['500'],
                themes.default.ids.color.option.pink['500'],
                themes.default.ids.color.option.red['500']
              ]
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

function generateMultipleMetricsWithGaps(numSeries, numMetrics, maxValue, windowSize, nonUniform = false) {
  const series = [];
  for (let i = 0; i < numSeries; i++) {
    series[i] = generateMetricsWithGaps(numMetrics, maxValue, windowSize, nonUniform, i);
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

function shiftMetrics(metrics) {
  let temp = metrics[0][1];
  for (let i = 1; i < metrics.length; i++) {
    metrics[i - 1][1] = metrics[i][1];
  }
  metrics[metrics.length - 1][1] = temp;
  return metrics;
}

function generateMetricsWithGaps(numMetrics, maxValue, windowSize, nonUniform = false, whichSeries) {
  const metrics = generateMetrics(numMetrics, maxValue, windowSize);
  const slicedMetrics = metrics
    .slice(0, 5)
    .concat(metrics.slice(10, 15))
    .concat(metrics.slice(23, 25))
    .concat(metrics.slice(27, 30));
  const shiftGaps = nonUniform === true && whichSeries % 2 === 0;
  if (shiftGaps) {
    return shiftMetrics(slicedMetrics);
  } else {
    return metrics;
  }
}

function generateTimeframe(windowSize) {
  return {
    windowSize,
    to: fixedTimestamp
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
