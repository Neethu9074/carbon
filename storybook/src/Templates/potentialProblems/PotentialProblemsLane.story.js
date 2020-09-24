import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import PotentialProblemsLanePresenter from 'in-new-components/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import { alertRules, potentialProblemsCluster } from './potentialProblemsStorySharedData';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { close } from 'in-components/DialogPresenter/store';
import DialogPresenter from 'in-components/DialogPresenter';
import { compare } from 'in-services/util/number';

/* there are random data and current date is used */
export default {
  title: 'Templates|potentialProblems/PotentialProblemsLane',
  component: PotentialProblemsLanePresenter,
  parameters: {
    // ignoring this story because it renders differently everytime
    chromatic: { disable: true }
  },
  decorator: { text, action }
};

const now = 1600667400000;

const oneDay = 1000 * 60 * 60 * 12;
const timeConfig = generateTimeframe(oneDay);

const laneProps = {
  name: 'Payment',
  type: 'Service',
  applicationLabel: 'All Services',
  serviceLabel: 'acceptor',
  endpointLabel: 'POST /metrics',
  boundaryScope: 'INBOUND',
  tagFilters: [
    {
      name: 'application.id',
      operator: 'EQUALS',
      stringValue: 'applicationId'
    },
    {
      name: 'service.id',
      operator: 'EQUALS',
      stringValue: undefined
    },
    {
      name: 'endpoint.id',
      operator: 'EQUALS',
      stringValue: undefined
    }
  ]
};

export const PotentialProblemsMarkerLane = () => {
  return (
    <>
      <BarChart
        renderPostChartContent={props => (
          <MarkerLanesPresenter {...props}>
            <PotentialProblemsLanePresenter
              {...laneProps}
              potentialProblems={potentialProblemsCluster}
              alertRules={alertRules}
              renderSmartAlertDialogComponent={() => (
                <SmartAlertConfigDialogWrapper
                  applicationLabel={'applicationLabel'}
                  // formData={generateFormData({ ...laneProps })}
                  onClose={close}
                />
              )}
            />
          </MarkerLanesPresenter>
        )}
      />
      <DialogPresenter />
    </>
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
            // metrics: [generateMetrics(12, 100, oneDay)],
            metrics: [generateMetrics(7, 100, oneDay)],
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
