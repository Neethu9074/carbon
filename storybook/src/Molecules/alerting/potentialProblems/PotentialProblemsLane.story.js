/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { text } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import PotentialProblemsLanePresenter from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { alertRules, potentialProblemsCluster } from './potentialProblemsStorySharedData';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { generateMetrics, fixedTimestamp } from '../../../util/generateMetrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { close } from 'in-components/DialogPresenter/store';
import DialogPresenter from 'in-components/DialogPresenter';
import { noop } from 'in-services/fixedObjects';
import { hours } from 'in-services/time';

export default {
  title: 'Molecules|potentialProblems/PotentialProblemsLane',
  component: PotentialProblemsLanePresenter,
  decorator: { text, action }
};

const halfADay = hours.toMillis(12);
const timeConfig = generateTimeframe(halfADay);

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
      <ChartWithSomeData
        renderPostChartContent={props => (
          <MarkerLanesPresenter {...props}>
            <PotentialProblemsLanePresenter
              {...laneProps}
              queryValidator={noop}
              tagFilterExpression={EMPTY_EXPRESSION}
              applications={{}}
              potentialProblems={potentialProblemsCluster}
              alertRules={alertRules}
              renderSmartAlertDialogComponent={() => (
                <SmartAlertConfigDialogWrapper
                  applicationLabel={'applicationLabel'}
                  // formData={generateFormData({ ...laneProps })}
                  onClose={close}
                  startWithSimpleMode
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

function constructResult(error, isLoading, windowSize = halfADay) {
  return {
    errors: error == null ? [] : [error],
    progress: {
      loading: isLoading
    },
    data: { calls: generateMetrics(12, 100, windowSize) }
  };
}
