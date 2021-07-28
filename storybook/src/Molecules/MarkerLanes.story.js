/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import PotentialProblemsLanePresenter from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import AlertsPreviewLanePresenter from 'in-components/Chart/markerLanes/AlertsPreviewLane/AlertsPreviewLanePresenter';
import ReleasesLanePresenter from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLanePresenter';
import AlertsLanePresenter from 'in-components/Chart/markerLanes/AlertsLane/AlertsLanePresenter';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { generateMetrics, fixedTimestamp } from '../util/generateMetrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { minutes } from 'in-services/time';

export default {
  title: 'Molecules|MarkerLanes',
  component: MarkerLanesPresenter,
  decorator: { text, action }
};

const oneMinute = minutes.toMillis(1);
const timeConfig = generateTimeframe(oneMinute);

export const MarkerLanesBelowChart = () => {
  return (
    <ChartWithSomeData
      renderPostChartContent={props => (
        <MarkerLanesPresenter {...props}>
          <ReleasesLanePresenter releases={getReleases(timeConfig)} />
          <AlertsLanePresenter alerts={getAlertsAndIncidents(timeConfig)} />
          <ReleasesLanePresenter releases={getReleases(timeConfig)} />
        </MarkerLanesPresenter>
      )}
    />
  );
};

export const MarkerLanesAboveChart = () => {
  return (
    <ChartWithSomeData
      renderPreChartContent={props => (
        <MarkerLanesPresenter {...props}>
          <AlertsPreviewLanePresenter alerts={getAlerts(timeConfig)} />
        </MarkerLanesPresenter>
      )}
    />
  );
};

export const WidthLoadingIndicator = () => {
  return (
    <ChartWithSomeData
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
  );
};

function ChartWithSomeData({ renderPostChartContent, renderPreChartContent }) {
  return (
    // define a width so in storybook the whole chart fits easily without any need for scrolling
    <div style={{ width: 500 }}>
      <ResultAwareChart
        result={constructResult(null, false)}
        config={{
          timeConfig,
          y1: {
            renderer: Renderer.bar,
            labels: ['Calls'],
            metrics: ['calls'],
            metricIds: [],
            aggregation: 'awesomeAggregation'
          },
          renderPostChartContent,
          renderPreChartContent
        }}
      />
    </div>
  );
}

function generateTimeframe(windowSize) {
  return {
    windowSize,
    to: fixedTimestamp
  };
}

function constructResult(error, isLoading, windowSize = oneMinute) {
  return {
    errors: error == null ? [] : [error],
    progress: {
      loading: isLoading
    },
    data: { calls: generateMetrics(12, 100, windowSize) }
  };
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
