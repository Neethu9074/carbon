/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PotentialProblemsLanePresenter from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import ReleasesLanePresenter from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLanePresenter';
import AlertsLanePresenter from 'in-components/Chart/markerLanes/AlertsLane/AlertsLanePresenter';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { generateMetrics, fixedTimestamp } from 'in-test/util/generateMetrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { minutes } from 'in-services/time';

export default {
  component: MarkerLanesPresenter
};

const oneMinute = minutes.toMillis(1);
const oneHour = oneMinute * 60;
const timeConfig = generateTimeframe(oneHour);

// optional retry feature and helper for storybook
const RETRY_ARGS = {
  withOnRetryButton: false
};
function getOnRetryFeedbackHelper(args) {
  return args?.withOnRetryButton && (() => alert('Retry was triggered.'));
}

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

export const MarkerLanesBelowChartExceedingVisibleArea = () => {
  return (
    <ChartWithSomeData
      renderPostChartContent={props => (
        <MarkerLanesPresenter {...props}>
          {/*Alert lane can exceed left side due to alignment to metric granularity for events that started before the
             visible timeframe. These events are added to the first cluster, which however can be outside the visible area
             if not properly adjusted when rendering.*/}
          <AlertsLanePresenter alerts={getSmartAlertRelativeToStart(timeConfig, -0.02)} />
          <AlertsLanePresenter alerts={getSmartAlertRelativeToStart(timeConfig, -0.01)} />
          <AlertsLanePresenter alerts={getSmartAlertRelativeToStart(timeConfig, 0)} />
          <AlertsLanePresenter alerts={getSmartAlertRelativeToStart(timeConfig, 0.01)} />

          <AlertsLanePresenter alerts={getSmartAlertRelativeToStart(timeConfig, 0.5)} />

          <AlertsLanePresenter alerts={getSmartAlertRelativeToStart(timeConfig, 0.99)} />
          <AlertsLanePresenter alerts={getSmartAlertRelativeToStart(timeConfig, 1.0)} />
          <AlertsLanePresenter alerts={getSmartAlertRelativeToStart(timeConfig, 1.01)} />
          <AlertsLanePresenter alerts={getSmartAlertRelativeToStart(timeConfig, 1.02)} />
        </MarkerLanesPresenter>
      )}
    />
  );
};

export const MarkerLanesBelowChartWithError = args => {
  return (
    <ChartWithSomeData
      renderPostChartContent={props => (
        <MarkerLanesPresenter {...props}>
          <ReleasesLanePresenter
            releases={getReleases(timeConfig)}
            errorMessage={"Releases couldn't be loaded"}
            onRetry={getOnRetryFeedbackHelper(args)}
          />
          <AlertsLanePresenter
            alerts={getAlertsAndIncidents(timeConfig)}
            errorMessage={"Alerts couldn't be loaded"}
            onRetry={getOnRetryFeedbackHelper(args)}
          />
        </MarkerLanesPresenter>
      )}
    />
  );
};
MarkerLanesBelowChartWithError.args = { ...RETRY_ARGS };

export const MarkerLanesAboveChart = () => {
  return (
    <ChartWithSomeData
      renderPreChartContent={props => (
        <MarkerLanesPresenter {...props}>
          <AlertsLanePresenter alerts={getAlertsAndIncidents(timeConfig)} />
        </MarkerLanesPresenter>
      )}
    />
  );
};

export const MarkerLanesAboveChartWithError = args => {
  return (
    <ChartWithSomeData
      renderPreChartContent={props => (
        <MarkerLanesPresenter {...props} laneLabelsVisible>
          <AlertsLanePresenter
            alerts={getAlertsAndIncidents(timeConfig)}
            errorMessage={"Alerts couldn't be loaded"}
            onRetry={getOnRetryFeedbackHelper(args)}
          />
        </MarkerLanesPresenter>
      )}
    />
  );
};
MarkerLanesAboveChartWithError.args = { ...RETRY_ARGS };

export const MarkerLanesAboveChartWithLongError = args => {
  return (
    <ChartWithSomeData
      renderPreChartContent={props => (
        <MarkerLanesPresenter {...props} laneLabelsVisible>
          <AlertsLanePresenter
            alerts={getAlertsAndIncidents(timeConfig)}
            errorMessage={
              'You can add a Retry button in the control addon... ' +
              'An error with a long message ' +
              'which is very, very long ' +
              'and will not fit into the lane, ' +
              'because it is very, very long.'
            }
            onRetry={getOnRetryFeedbackHelper(args)}
          />
        </MarkerLanesPresenter>
      )}
    />
  );
};
MarkerLanesAboveChartWithLongError.args = { ...RETRY_ARGS };

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
export const MarkerLanesBelowChartForceHoverArea = () => {
  return (
    <ChartWithSomeData
      renderPostChartContent={props => (
        <MarkerLanesPresenter {...props} chartBucketWidth={0}>
          <ReleasesLanePresenter releases={getReleases(timeConfig)} />
          <AlertsLanePresenter alerts={getAlertsAndIncidents(timeConfig)} />
          <ReleasesLanePresenter releases={getReleases(timeConfig)} />
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
            metrics: generateMetrics(12, 100, oneHour),
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
          name: 'Release Lane Test: 1',
          start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 10),
          id: '2WqiOdUES2yLLk8kqKfxz1',
          lastUpdated: 1594973648774
        },
        {
          name: 'Release Lane Test: 2',
          start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 10),
          id: '2WqiOdUES2yLLk8kqKfxz2',
          lastUpdated: 1594973648774
        },
        {
          name: 'Release Lane Test: 3',
          start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 10),
          id: '2WqiOdUES2yLLk8kqKfxz3',
          lastUpdated: 1594973648774
        },
        {
          name: 'Release Lane Test: 3',
          start: timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 10),
          id: '2WqiOdUES2yLLk8kqKfxz4',
          lastUpdated: 1594973648774
        }
      ]
    };
  }
  return events;
}

function getAlertsAndIncidents(timeConfig) {
  const events = [];
  const numEvents = 8;
  for (let i = 0; i < numEvents; i++) {
    const timestamp = timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 9);
    events[i] = {
      timestamp,
      smartAlerts:
        i % 2 !== 0
          ? [
              createEvent(
                "I'm a cool smart alert",
                timestamp,
                timeConfig.windowSize * (i / 9),
                timeConfig.windowSize * (i / 7)
              )
            ]
          : [],
      incidents:
        i % 2 === 0
          ? [
              createEvent(
                "I'm a cool Incident",
                timestamp,
                timeConfig.windowSize * (i / 9),
                timeConfig.windowSize * (i / 7)
              ),
              createEvent(
                "I'm an awesome Incident",
                timestamp,
                timeConfig.windowSize * (i / 9),
                timeConfig.windowSize * (i / 5)
              )
            ]
          : []
    };
  }

  const timestamp = timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (3 / 9);
  events[3] = {
    timestamp,
    smartAlerts: [
      createEvent("I'm a cool smart alert", timestamp, timeConfig.windowSize * (1 / 9), timeConfig.windowSize * (3 / 9))
    ],
    incidents: [
      createEvent(
        "I'm a cool Incident in a cluster",
        timestamp,
        timeConfig.windowSize * (2 / 9),
        timeConfig.windowSize * (1 / 5)
      ),
      createEvent(
        "I'm an awesome Incident in a cluster",
        timestamp,
        timeConfig.windowSize * (1 / 9),
        timeConfig.windowSize * (1 / 9)
      )
    ]
  };

  return events;
}

function getSmartAlertRelativeToStart(timeConfig, relativeStart) {
  const timestamp = timeConfig.to - (1 - relativeStart) * timeConfig.windowSize;
  return [
    {
      timestamp,
      smartAlerts: [
        createEvent(`I'm a smart alert`, timestamp, timeConfig.windowSize * (1 / 9), timeConfig.windowSize * (2 / 9))
      ],
      incidents: []
    }
  ];
}

function createEvent(name, timestamp, durationBefore, durationAfter) {
  return {
    eventId: 'ZBW7TkyST2mh6xy9foCtFA',
    name,
    triggeringTime: timestamp - durationBefore,
    start: timestamp,
    end: timestamp + durationAfter,
    duration: durationBefore + durationAfter
  };
}
