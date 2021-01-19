/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import PotentialProblemsLanePresenter from 'in-new-components/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import AlertsPreviewLanePresenter from 'in-components/Chart/markerLanes/AlertsPreviewLane/AlertsPreviewLanePresenter';
import ReleasesLanePresenter from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLanePresenter';
import AlertsLanePresenter from 'in-components/Chart/markerLanes/AlertsLane/AlertsLanePresenter';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import DialogWithSlideInView from 'in-new-components/Dialog/DialogWithSlideInView';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { compare } from 'in-services/util/number';
import { minutes } from 'in-services/time';

/* there are random data and current date is used */
export default {
  title: 'Molecules|MarkerLanes',
  component: DialogWithSlideInView,
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  decorator: { text, action }
};

const now = 1598609654147;

const oneMinute = minutes.toMillis(1);
const timeConfig = generateTimeframe(oneMinute);

export const MarkerLanesBelowChart = () => {
  return (
    <div>
      <h2>Marker lanes</h2>
      <BarChart
        renderPostChartContent={props => (
          <MarkerLanesPresenter {...props}>
            <ReleasesLanePresenter releases={getReleases(timeConfig)} />
            <AlertsLanePresenter alerts={getAlertsAndIncidents(timeConfig)} />
            <ReleasesLanePresenter releases={getReleases(timeConfig)} />
          </MarkerLanesPresenter>
        )}
      />
    </div>
  );
};

export const MarkerLanesAboveChart = () => {
  return (
    <div>
      <h2>Marker lanes</h2>
      <BarChart
        renderPreChartContent={props => (
          <MarkerLanesPresenter {...props}>
            <AlertsPreviewLanePresenter alerts={getAlerts(timeConfig)} />
          </MarkerLanesPresenter>
        )}
      />
    </div>
  );
};

export const WidthLoadingIndicator = () => {
  return (
    <div>
      <h2>Marker lanes</h2>
      <BarChart
        renderPostChartContent={props => (
          <MarkerLanesPresenter {...props}>
            <AlertsLanePresenter alerts={[]} isLoading />
            <PotentialProblemsLanePresenter
              potentialProblems={{
                alerts: [],
                thresholds: {}
              }}
              isLoading
            />
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
            metrics: ['calls'],
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
    },
    data: { calls: generateMetrics(12, 100, oneMinute) }
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

function getReleases(timeConfig) {
  const events = [];
  const numEvents = 8;
  for (let i = 0; i < numEvents; i++) {
    events[i] = {
      count: 1,
      timestamp: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 10),
      clusteredReleases: [
        {
          name: 'Release Lane Test: abc',
          start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 10),
          id: '2WqiOdUES2yLLk8kqKfxzQ',
          lastUpdated: 1594973648774
        }
      ]
    };
  }
  return events;
}

function getAlerts(timeConfig) {
  const events = [];
  const numEvents = 18;
  for (let i = 0; i < numEvents; i++) {
    events[i] = {
      timestamp: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 8),
      numAlertsInCluster: i
    };
  }

  return events;
}

function getAlertsAndIncidents(timeConfig) {
  const events = [];
  const numEvents = 12;
  for (let i = 0; i < numEvents; i++) {
    events[i] = {
      timestamp: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 9), // backend property name is "timestamp"
      smartAlerts:
        i % 2 !== 0
          ? [
              {
                eventId: 'ZBW7TkyST2mh6xy9foCtFA',
                name: "I'm a cool smart alert",
                triggeringTime: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 9),
                start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 8),
                end: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 7),
                duration:
                  timeConfig.to -
                  timeConfig.windowSize +
                  timeConfig.windowSize * (i / 7) -
                  (timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 9))
              }
            ]
          : [],
      incidents:
        i % 2 === 0
          ? [
              {
                eventId: 'ZBW7TkyST2mh6xy9foCtFA',
                name: "I'm a cool Incident",
                triggeringTime: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 9),
                start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 8),
                end: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 7),
                duration:
                  timeConfig.to -
                  timeConfig.windowSize +
                  timeConfig.windowSize * (i / 7) -
                  (timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 9))
              },
              {
                eventId: 'ZBW7TkyST2mh6xy9foCtFA',
                name: "I'm an awesome Incident",
                triggeringTime: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 9),
                start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 7),
                end: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 5),
                duration:
                  timeConfig.to -
                  timeConfig.windowSize +
                  timeConfig.windowSize * (i / 5) -
                  (timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 9))
              }
            ]
          : []
    };
  }

  events[3] = {
    timestamp: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 9), // backend property name is "timestamp"
    smartAlerts: [
      {
        eventId: 'ZBW7TkyST2mh6xy9foCtFA',
        name: "I'm a cool smart alert",
        triggeringTime: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 9),
        start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 7),
        end: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 5),
        duration:
          timeConfig.to -
          timeConfig.windowSize +
          timeConfig.windowSize * (3 / 5) -
          (timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 9))
      }
    ],
    incidents: [
      {
        eventId: 'ZBW7TkyST2mh6xy9foCtFA',
        name: "I'm a cool Incident in a cluster",
        triggeringTime: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 9),
        start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 7),
        end: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 5),
        duration:
          timeConfig.to -
          timeConfig.windowSize +
          timeConfig.windowSize * (3 / 5) -
          (timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 9))
      },
      {
        eventId: 'ZBW7TkyST2mh6xy9foCtFA',
        name: "I'm an awesome Incident in a cluster",
        triggeringTime: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 9),
        start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 7),
        end: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 5),
        duration:
          timeConfig.to -
          timeConfig.windowSize +
          timeConfig.windowSize * (3 / 5) -
          (timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 9))
      }
    ]
  };

  return events;
}
