/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import LatencyDistributionBase10Chart from 'in-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistributionBase10 from 'in-applications/subscriptions/getLatencyDistributionBase10';
import { jumpToUnboundedAnalyticsFromLatencyTracker } from 'in-applications/tracker';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { createChartedMetric, createOrderBy } from 'in-analyze/navigation/paths';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { fixateTimeConfig } from 'in-stores/time/config';
import { emptyObject } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function LatencyDistributionHistogram({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  syntheticCalls
}) {
  const [selectedLatencyRange, setSelectedLatencyRange] = useState({ from: null, to: null });
  const timeShiftConfig = useTimeShiftConfig();

  const hiddenCalls = createHiddenCallsFromSyntheticOption(syntheticCalls);

  const latencyFacet =
    !selectedLatencyRange.from && !selectedLatencyRange.to ? emptyObject : { 'call.latency': [selectedLatencyRange] };

  const latencyDistRequest = {
    maxLatencyBuckets: 80,
    includePercentiles: true,
    ...hiddenCalls,
    filter: {
      timeConfig
    },
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'TAG_FILTER',
          name: boundaryScope === 'INBOUND' ? 'boundary.application.id' : 'application.id',
          stringValue: applicationId,
          operator: EQUALS
        },
        {
          type: 'TAG_FILTER',
          name: 'service.id',
          stringValue: serviceId,
          operator: EQUALS
        },
        {
          type: 'TAG_FILTER',
          name: 'endpoint.id',
          stringValue: endpointId,
          operator: EQUALS
        }
      ]
        // filter out filters with missing values
        .filter(e => e.stringValue != null)
    }
  };
  const timeShiftLatencyDistRequest = {
    ...latencyDistRequest,
    includePercentiles: false,
    timeShift: translateOffsetToTimeShiftConfig(timeShiftConfig.offset, timeConfig)
  };
  return (
    <LatencyDistributionBase10Chart
      dataSource="calls"
      subscription={getLatencyDistributionBase10(latencyDistRequest)}
      timeShiftSubscription={timeShiftConfig.offset && getLatencyDistributionBase10(timeShiftLatencyDistRequest)}
      selectionMenuItems={[
        {
          name: 'analyze',
          icon: 'lib_analyze',
          label: t('in-applications:lineViewInAnalyze'),
          getHref$: () =>
            getJumpToAnalyzeHref$(
              { applicationId: applicationId, serviceId: serviceId, endpointId: endpointId },
              {
                timeConfig: fixateTimeConfig(timeConfig),
                boundaryScope,
                formModel: createFormModelFromSyntheticOption(syntheticCalls),
                facets: latencyFacet,
                hiddenCalls,
                chartedMetrics: [createChartedMetric('latency', 'DISTRIBUTION')],
                orderBy: createOrderBy('latency', 'DESC')
              }
            ),
          onClick: () => {
            jumpToUnboundedAnalyticsFromLatencyTracker({
              applicationId: applicationId,
              serviceId: serviceId,
              endpointId: endpointId,
              boundaryScope: boundaryScope,
              from: selectedLatencyRange.from,
              to: selectedLatencyRange.to
            });
          }
        }
      ]}
      onSelectionChanged={setSelectedLatencyRange}
      showLegend
      timeShiftConfig={timeShiftConfig}
    />
  );
}
