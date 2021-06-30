/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useRef } from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  hasPotentialProblems,
  potentialProblemsCallsUnexpectedLowNumber,
  potentialProblemsCallsUnexpectedHighNumber
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/potentialProblemsForm';
import {
  throughputLowAlertRule,
  throughputHighAlertRule,
  getLatencyAlertRule,
  errorRateAlertRule
} from 'in-custom-dashboards/widgets/Chart/PotentialProblems/potentialProblemsAlertRules';
import PotentialProblemsLanePresenter from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import isOutsideCallsShortTermStorage from 'in-alerting/PotentialProblems/PotentialProblemsLane/isOutsideCallsShortTermStorage';
import getPotentialProblems from 'in-alerting/PotentialProblems/subscription/getPotentialProblems';
import { isCallQueryValid } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { trackRequestLoadingTime } from 'in-alerting/PotentialProblems/tracker';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';

export function PotentialProblemsPostChartContent({ markerLaneProps, openingDialogDisabled, config, widgetTitle }) {
  const globalTimeConfig = useTimeConfig();

  const outsideCallsShortTermStorage = isOutsideCallsShortTermStorage(globalTimeConfig);

  const configuredDataset = useMemo(() => {
    return [...config.y1?.metrics, ...config.y2?.metrics].find(hasPotentialProblems);
  }, [config]);

  const alertRules = getAlertRules(configuredDataset);
  const startTime = useRef(null);

  const potentialProblemsResult =
    useObservable(() => {
      if (!outsideCallsShortTermStorage && alertRules) {
        return getPotentialProblems({
          timeConfig: globalTimeConfig,
          alertRules,
          includeSynthetic: configuredDataset?.includeSynthetic ?? false,
          includeInternal: configuredDataset?.includeInternal ?? false,
          tagFilterExpression: configuredDataset?.tagFilterExpression ?? EMPTY_EXPRESSION
        })
          .startWith(pendingResult)
          .tap(result => {
            const start = startTime.current;
            if (isLoading(result) && !start) {
              startTime.current = Date.now();
            } else if (start) {
              if (result.data?.alerts.length !== 0) {
                trackRequestLoadingTime({
                  requestTime: `${Date.now() - start / 1000}s`,
                  numberPotentialProblems: result.data.alerts.length,
                  windowSize: globalTimeConfig.windowSize,
                  widgetTitle
                });
                startTime.current = null;
              }
            }
          });
      }

      return just(emptyPotentialProblems);
    }, [
      // alertRules and configuredDataset, etc. are all derived from config itself
      config
    ]) ?? pendingResult;

  return (
    <MarkerLanesPresenter {...markerLaneProps}>
      {!outsideCallsShortTermStorage && (
        <PotentialProblemsLanePresenter
          potentialProblems={potentialProblemsResult?.data ?? emptyPotentialProblems}
          alertRules={alertRules}
          isLoading={isLoading(potentialProblemsResult)}
          openingDialogDisabled={openingDialogDisabled}
          tagFilterExpression={configuredDataset?.tagFilterExpression ?? EMPTY_EXPRESSION}
          includeSynthetic={configuredDataset?.includeSynthetic}
          includeInternal={configuredDataset?.includeInternal}
          queryValidator={isCallQueryValid}
          applications={{}}
        />
      )}
    </MarkerLanesPresenter>
  );
}

function getAlertRules(configuredDataset) {
  const configuredMetric = configuredDataset?.metric;

  if (configuredMetric === 'calls') {
    const configuredBluePrintForCalls = configuredDataset?.potentialProblems?.bluePrintForCallsMetric;

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
