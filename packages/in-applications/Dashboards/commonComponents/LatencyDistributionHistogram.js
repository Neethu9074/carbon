/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import {
  createFormModelFromSyntheticOption,
  createHiddenCallsFromSyntheticOption
} from 'in-applications/Dashboards/commonComponents/includeSyntheticCalls';
import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import { EQUALS, GREATER_OR_EQUAL_THAN, LESS_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { jumpToUnboundedAnalyticsFromLatencyTracker } from 'in-applications/tracker';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { createChartedMetric, createOrderBy } from 'in-analyze/navigation/paths';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { fixateTimeConfig } from 'in-stores/time/config';
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

  const formModelForLink = () => {
    const { from, to } = selectedLatencyRange;
    let formModel = [];
    if (from != null && from === to) {
      formModel = joinExpressions({ expressions: [formModel, tagFilter('call.latency', EQUALS, from)] });
    } else {
      if (from > 0) {
        formModel = joinExpressions({
          expressions: [formModel, tagFilter('call.latency', GREATER_OR_EQUAL_THAN, from)]
        });
      }
      if (to) {
        formModel = joinExpressions({ expressions: [formModel, tagFilter('call.latency', LESS_THAN, to)] });
      }
    }
    return formModel;
  };

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
                formModel: joinExpressions({
                  expressions: [createFormModelFromSyntheticOption(syntheticCalls), formModelForLink()]
                }),
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
