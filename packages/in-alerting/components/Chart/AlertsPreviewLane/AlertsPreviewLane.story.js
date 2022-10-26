/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest, just, timeout } from '@instana/observables';

import AlertsPreviewLane from 'in-alerting/components/Chart/AlertsPreviewLane/AlertsPreviewLane';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { fixedTimestamp } from 'in-test/util/generateMetrics';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { error, success } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { minutes } from 'in-services/time';

export default {
  component: AlertsPreviewLane
};

const oneMinute = minutes.toMillis(1);
const timeConfig = generateTimeframe(oneMinute);

const validAlertsPreviewConfiguration = {
  threshold: {
    type: STATIC_THRESHOLD,
    value: 0
  }
};

const alertsExampleData = success({ alerts: getAlerts(timeConfig) });
const emptyAlertExampleData = success({ alerts: [] });

export const Default = () => {
  const getAlertsPreview = () => just(alertsExampleData);

  return (
    <ChartWithSomeData
      renderPreChartContent={props => (
        <MarkerLanesPresenter {...props} laneLabelsVisible>
          <AlertsPreviewLane
            alertsPreviewConfiguration={validAlertsPreviewConfiguration}
            getAlertsPreview={getAlertsPreview}
          />
        </MarkerLanesPresenter>
      )}
    />
  );
};
export const DefaultWithLoadingAlerts = () => {
  const getAlertsPreview = () =>
    combineLatest([just(alertsExampleData), timeout(2000)]).map(([resultData]) => {
      return resultData;
    });
  return (
    <ChartWithSomeData
      renderPreChartContent={props => (
        <MarkerLanesPresenter {...props} laneLabelsVisible>
          <AlertsPreviewLane
            alertsPreviewConfiguration={validAlertsPreviewConfiguration}
            getAlertsPreview={getAlertsPreview}
          />
        </MarkerLanesPresenter>
      )}
    />
  );
};

export const DefaultWithLoadingNoAlerts = () => {
  const getAlertsPreview = () =>
    combineLatest([just(emptyAlertExampleData), timeout(2000)]).map(([resultData]) => {
      return resultData;
    });
  return (
    <ChartWithSomeData
      renderPreChartContent={props => (
        <MarkerLanesPresenter {...props} laneLabelsVisible>
          <AlertsPreviewLane
            alertsPreviewConfiguration={validAlertsPreviewConfiguration}
            getAlertsPreview={getAlertsPreview}
          />
        </MarkerLanesPresenter>
      )}
    />
  );
};

export const AlertsPreviewLaneFailingWithRetry = () => {
  const getAlertsPreview = () =>
    combineLatest([just(error([{ message: 'random error message after 2 seconds', code: 'TIMEOUT' }])), timeout(2000)])
      .map(([resultData]) => resultData)
      .startWith(pendingResult);
  return (
    <ChartWithSomeData
      renderPreChartContent={props => (
        <MarkerLanesPresenter {...props} laneLabelsVisible>
          <AlertsPreviewLane
            alertsPreviewConfiguration={validAlertsPreviewConfiguration}
            getAlertsPreview={getAlertsPreview}
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
        result={success({})}
        config={{
          timeConfig,
          y1: {
            renderer: Renderer.bar,
            metrics: [[[0, fixedTimestamp]]],
            metricIds: []
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

function getAlerts(timeConfig) {
  const events = [];
  const numEvents = 18;
  for (let i = 0; i < numEvents; i++) {
    events[i] = [timeConfig.to - timeConfig.windowSize + timeConfig.windowSize * (i / 8), i];
  }

  return events;
}
