/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import { EQUALS, GREATER_OR_EQUAL_THAN, LESS_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { jumpToUnboundedAnalyticsFromLatencyTracker } from 'in-applications/tracker';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { fixateTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default function LatencyDistributionHistogram({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  includeSyntheticCalls
}) {
  const [selectedLatencyRange, setSelectedLatencyRange] = useState({ from: null, to: null });
  const tagCatalog = useTagCatalog(getTagCatalog);
  const timeShiftConfig = useTimeShiftConfig();

  const filterForLink = () => {
    const { from, to } = selectedLatencyRange;
    let filters = [];
    if (from != null && from === to) {
      filters.push({
        name: 'call.latency',
        value: from,
        operator: EQUALS
      });
    } else {
      if (from > 0) {
        filters.push({
          name: 'call.latency',
          value: from,
          operator: GREATER_OR_EQUAL_THAN
        });
      }
      if (to) {
        filters.push({
          name: 'call.latency',
          value: to,
          operator: LESS_THAN
        });
      }
    }
    if (includeSyntheticCalls) {
      filters.push({
        name: 'include_synthetic',
        value: 'true'
      });
    }
    return filters;
  };

  const latencyDistRequest = {
    maxLatencyBuckets: 80,
    includePercentiles: true,
    includeSynthetic: includeSyntheticCalls || false,
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
            tagCatalog &&
            getJumpToAnalyzeHref$(
              { applicationId: applicationId, serviceId: serviceId, endpointId: endpointId },
              {
                timeConfig: fixateTimeConfig(timeConfig),
                boundaryScope,
                groupByTag: {},
                filters: filterForLink(),
                tagCatalog: tagCatalog,
                focusedMetric: 'latency_DISTRIBUTION',
                orderBy: 'latency',
                orderDirection: 'DESC'
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
