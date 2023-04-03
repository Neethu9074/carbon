/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  alertRules,
  potentialProblemsCluster
} from 'in-alerting/PotentialProblems/PotentialProblemDialog/stories/potentialProblemsStorySharedData';
import PotentialProblemsLanePresenter from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { generateAlertConfig } from 'in-alerting/smart-alerts/applications/CreateSmartAlert';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { generateMetrics, fixedTimestamp } from 'in-test/util/generateMetrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { close } from 'in-components/DialogPresenter/store';
import DialogPresenter from 'in-components/DialogPresenter';
import { hours } from 'in-services/time';

export default {
  component: PotentialProblemsLanePresenter
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
              tagFilterExpression={EMPTY_EXPRESSION}
              applications={{}}
              potentialProblems={potentialProblemsCluster}
              alertRules={alertRules}
              renderSmartAlertDialogComponent={() => (
                <AlertConfigDialog
                  applicationLabel="applicationLabel"
                  alertConfig={generateAlertConfig({ ...laneProps })}
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
