import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import SmartAlertMarkerLanePresenter from 'in-components/Chart/markerLanes/AlertMarkerLane/SmartAlertMarkerLanePresenter';
import ReleaseMarkerLanePresenter from 'in-components/Chart/markerLanes/ReleaseMarkerLane/ReleaseMarkerLanePresenter';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import DialogWithSlideInView from 'in-new-components/Dialog/DialogWithSlideInView';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { compare } from 'in-services/util/number';

export default {
  title: 'Molecules|MarkerLanes',
  component: DialogWithSlideInView,
  decorator: { text, action }
};

const now = Date.now();

const oneMinute = 1000 * 60;
const timeConfig = generateTimeframe(oneMinute);

export const MarkerLanes = () => {
  function getReleases(timeConfig) {
    const randomEvents = [];
    const numEvents = 8;
    for (let i = 0; i < numEvents; i++) {
      randomEvents[i] = {
        count: 1,
        startTime: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * 8000,
        clusteredReleases: [
          {
            name: 'Release Lane Test: abc',
            start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * 9000,
            id: '2WqiOdUES2yLLk8kqKfxzQ',
            lastUpdated: 1594973648774
          }
        ]
      };
    }
    return randomEvents;
  }

  function getAlerts(timeConfig) {
    const randomEvents = [];
    const numEvents = 8;
    for (let i = 0; i < numEvents; i++) {
      randomEvents[i] = {
        start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * Math.random(),
        numAlertsInCluster: i
      };
    }

    return randomEvents;
  }

  return (
    <div>
      <h2>Marker lanes</h2>
      <BarChart
        renderPostChartContent={props => (
          <MarkerLanesPresenter {...props}>
            <ReleaseMarkerLanePresenter releases={getReleases(timeConfig)} />
            <SmartAlertMarkerLanePresenter alerts={getAlerts(timeConfig)} />
            <ReleaseMarkerLanePresenter releases={getReleases(timeConfig)} />
            <SmartAlertMarkerLanePresenter alerts={getAlerts(timeConfig)} />
          </MarkerLanesPresenter>
        )}
      />
    </div>
  );
};

export const MarkerLanesAboveChart = () => {
  function getAlerts(timeConfig) {
    const randomEvents = [];
    const numEvents = 8;
    for (let i = 0; i < numEvents; i++) {
      randomEvents[i] = {
        start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * Math.random(),
        numAlertsInCluster: i
      };
    }

    return randomEvents;
  }

  return (
    <div>
      <h2>Marker lanes above chart (Smart Alerts preview lane)</h2>
      <BarChart
        renderPreChartContent={props => (
          <MarkerLanesPresenter {...props}>
            <SmartAlertMarkerLanePresenter alerts={getAlerts(timeConfig)} />
          </MarkerLanesPresenter>
        )}
      />
    </div>
  );
};

function BarChart({ renderPostChartContent, renderPreChartContent }) {
  return (
    <>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig,
          y1: {
            renderer: Renderer.bar,
            labels: ['Calls'],
            metrics: [generateMetrics(12, 100, oneMinute)],
            aggregation: 'awesomeAggregation'
          },
          renderPostChartContent,
          renderPreChartContent
        }}
      />
    </>
  );
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
