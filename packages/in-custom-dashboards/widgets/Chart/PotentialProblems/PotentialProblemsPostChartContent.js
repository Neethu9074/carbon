/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  throughputLowAlertRule,
  throughputHighAlertRule,
  getLatencyAlertRule,
  errorRateAlertRule
} from 'in-custom-dashboards/widgets/Chart/PotentialProblems/potentialProblemsAlertRules';
import {
  potentialProblemsCallsUnexpectedLowNumber,
  potentialProblemsCallsUnexpectedHighNumber
} from 'in-custom-dashboards/widgets/Chart/FormComponent/potentialProblemsForm';
import PotentialProblemsLanePresenter from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import getPotentialProblems from 'in-alerting/PotentialProblems/subscription/getPotentialProblems';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';

export function PotentialProblemsPostChartContent({ markerLaneProps, config }) {
  const globalTimeConfig = useTimeConfig();

  const configuredDataset = useMemo(() => {
    const [axis, index] = config?.potentialProblems?.dataset.toLowerCase().split('.');
    return config[axis]?.metrics[parseInt(index) - 1];
  }, [config]);

  const alertRules = getAlertRules(configuredDataset, config);

  const potentialProblemsResult =
    useObservable(() => {
      if (alertRules) {
        return getPotentialProblems({
          timeConfig: globalTimeConfig,
          alertRules,
          includeSynthetic: configuredDataset?.includeSynthetic ?? false,
          includeInternal: configuredDataset?.includeInternal ?? false,
          tagFilterExpression: configuredDataset?.tagFilterExpression ?? EMPTY_EXPRESSION
        });
      }

      return just(emptyPotentialProblems);
    }, [
      // alertRules and configuredDataset, etc. are all derived from config itself
      config
    ]) ?? pendingResult;

  return (
    <MarkerLanesPresenter {...markerLaneProps}>
      <PotentialProblemsLanePresenter
        potentialProblems={potentialProblemsResult?.data ?? emptyPotentialProblems}
        alertRules={alertRules}
        isLoading={isLoading(potentialProblemsResult)}
        tagFilterExpression={configuredDataset?.tagFilterExpression ?? EMPTY_EXPRESSION}
        applications={{}}
      />
    </MarkerLanesPresenter>
  );
}

function getAlertRules(configuredDataset, config) {
  const configuredMetric = configuredDataset?.metric;

  if (configuredMetric === 'calls') {
    const configuredBluePrintForCalls = config?.potentialProblems?.bluePrintForCallsMetric;

    if (configuredBluePrintForCalls === potentialProblemsCallsUnexpectedLowNumber) {
      return throughputLowAlertRule;
    }
    if (configuredBluePrintForCalls === potentialProblemsCallsUnexpectedHighNumber) {
      return throughputHighAlertRule;
    }

    return { ...throughputHighAlertRule, ...throughputLowAlertRule };
  }

  if (configuredMetric === 'latency') {
    return getLatencyAlertRule(configuredDataset?.aggregation);
  }

  if (configuredMetric === 'errors') {
    return errorRateAlertRule;
  }

  return null;
}

const emptyPotentialProblems = {
  alerts: [],
  thresholds: {}
};
