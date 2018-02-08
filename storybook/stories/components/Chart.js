import { storiesOf } from '@storybook/react';
import React from 'react';

import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import { percentage } from 'in-services/formatters/number';
import { just, interval } from 'reactive-observables';
import { compare } from 'in-services/util/number';
import connectTo from 'in-hoc/connectTo';
import Root from '../_helpers/Root';

const oneSecond = 1000;
const oneMinute = oneSecond * 60;
const oneHour = oneMinute * 60;
const now = Date.now();

storiesOf('components/Chart', module)
  .add('Missing Data', () => <MissingData />)
  .add('Simple', () => <Simple />)
  .add('Multiple Series', () => <MultipleSeries />)
  .add('Dual Axis', () => <DualAxis />)
  .add('Dual Axis Different Rollup', () => <DualAxisDifferentMetricCount />)
  .add('Gaps', () => <Gaps />)
  .add('Bar', () => <Bar />)
  .add('Area', () => <Area />)
  .add('StackedArea', () => <StackedArea />)
  .add('Integral', () => <Integral />)
  .add('CountErrorBar', () => <CountErrorBar />)
  .add('Resize', () => <Resize />);

function MissingData() {
  return (
    <Root>
      <Chart />
    </Root>
  );
}

function Simple() {
  return (
    <Root>
      <Chart
        minRollup={oneHour / 20}
        timeframe={generateTimeframe(oneHour)}
        y1={{
          renderer: Renderer.line,
          labels: ['Calls'],
          metrics: [generateMetrics(75, 20, oneHour)]
        }}
      />
    </Root>
  );
}

function MultipleSeries() {
  return (
    <Root>
      <Chart
        minRollup={oneMinute / 5}
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.line,
          labels: ['Calls', 'Count'],
          metrics: [generateMetrics(10, 5, oneMinute), generateMetrics(10, 5, oneMinute)]
        }}
      />
    </Root>
  );
}

function DualAxis() {
  return (
    <Root>
      <Chart
        minRollup={oneMinute / 10}
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.line,
          labels: ['Calls', 'Count'],
          metrics: [generateMetrics(10, 10, oneMinute), generateMetrics(10, 5, oneMinute)]
        }}
        y2={{
          renderer: Renderer.line,
          labels: ['Latency'],
          metrics: [generateMetrics(10, 1, oneMinute)],
          formatter: percentage
        }}
      />
    </Root>
  );
}

function DualAxisDifferentMetricCount() {
  return (
    <Root>
      <Chart
        minRollup={oneMinute / 10}
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.line,
          labels: ['Calls', 'Count'],
          metrics: [generateMetrics(10, 10, oneMinute), generateMetrics(4, 5, oneMinute)]
        }}
        y2={{
          renderer: Renderer.line,
          labels: ['Latency'],
          metrics: [generateMetrics(5, 1, oneMinute)],
          formatter: percentage
        }}
      />
    </Root>
  );
}

function Gaps() {
  return (
    <Root>
      <Chart
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.line,
          labels: ['Calls'],
          metrics: [generateMetricsWithGaps(30, 10, oneMinute)]
        }}
      />
    </Root>
  );
}

function Bar() {
  return (
    <Root>
      <Chart
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.bar,
          labels: ['Calls'],
          metrics: [generateMetrics(12, 100, oneMinute)],
          aggregation: 'awesomeAggregation'
        }}
      />
    </Root>
  );
}

function Area() {
  return (
    <Root>
      <Chart
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.area,
          labels: ['Calls', 'Count'],
          metrics: [generateMetrics(30, 10, oneMinute), generateMetricsWithGaps(30, 10, oneMinute)]
        }}
      />
    </Root>
  );
}

function StackedArea() {
  return (
    <Root>
      <Chart
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.stackedArea,
          labels: ['foo', 'bar', 'baz'],
          metrics: generateMultipleMetrics(3, 30, 10, oneMinute)
        }}
      />
      <Chart
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.stackedArea,
          labels: ['1', '2', '3', '4', '5'],
          metrics: generateMultipleMetricsWithGaps(5, 30, 10, oneMinute)
        }}
      />
    </Root>
  );
}

function Integral() {
  return (
    <Root>
      <Chart
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.integral,
          labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
          metrics: generateMultipleMetrics(8, 30, 10, oneMinute)
        }}
      />
      <Chart
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.integral,
          labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
          metrics: generateMultipleMetricsWithGaps(8, 30, 10, oneMinute)
        }}
      />
    </Root>
  );
}

function CountErrorBar() {
  return (
    <Root>
      <Chart
        timeframe={generateTimeframe(oneMinute)}
        y1={{
          renderer: Renderer.countErrorBar,
          labels: ['Count', 'Error'],
          colors: ['#5da6da', '#ff4229'],
          metrics: [generateMetrics(10, 20, oneMinute), generateMetrics(10, 0.7, oneMinute)],
          aggregation: 'awesomeAggregation'
        }}
      />
    </Root>
  );
}

const Resize = connectTo(
  () => {
    return {
      metrics: just(generateMetrics(20, 10, oneHour)),
      size: interval(1000)
        .map(() => ({ width: Math.max(200, Math.random() * 700) | 0, height: Math.max(60, (Math.random() * 200) | 0) }))
        .startWith({ width: 400, height: 150 })
    };
  },
  function Resize({ size, metrics }) {
    return (
      <Root>
        <Chart
          width={size.width}
          height={size.height}
          timeframe={generateTimeframe(oneHour)}
          minRollup={oneHour / 20}
          y1={{
            renderer: Renderer.line,
            labels: ['Calls'],
            metrics: [metrics]
          }}
        />
      </Root>
    );
  }
);

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
  const metrics = [];
  for (let i = numMetrics; i >= 0; i--) {
    metrics[i] = [now - i * (windowSize / numMetrics), ((Math.random() * maxValue * 100) | 0) / 100];
  }
  metrics.sort((a, b) => compare(a[0], b[0]));
  return metrics;
}

function generateTimeframe(windowSize) {
  return {
    windowSize,
    to: now
  };
}
