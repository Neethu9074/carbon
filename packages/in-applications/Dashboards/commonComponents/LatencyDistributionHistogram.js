import React, { useState } from 'react';

import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import { jumpToUnboundedAnalyticsFromLatencyTracker } from 'in-applications/tracker';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { operators } from 'in-analyze/applicationFilter';
import { fixateTimeConfig } from 'in-stores/time/config';

export default function LatencyDistributionHistogram({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  includeSyntheticCalls
}) {
  const [selectedLatencyRange, setSelectedLatencyRange] = useState({ from: null, to: null });

  const filterForLink = () => {
    const { from, to } = selectedLatencyRange;
    let filters = [];
    if (from != null && from === to) {
      filters.push({
        name: 'call.latency',
        value: from,
        operator: 'EQUALS'
      });
    } else {
      if (from > 0) {
        filters.push({
          name: 'call.latency',
          value: from,
          operator: 'GREATER_OR_EQUAL_THAN'
        });
      }
      if (to) {
        filters.push({
          name: 'call.latency',
          value: to,
          operator: 'LESS_THAN'
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

  return (
    <LatencyDistributionBase10Chart
      dataSource="calls"
      subscription={getLatencyDistributionBase10({
        maxLatencyBuckets: 80,
        filter: {
          timeConfig,
          application: applicationId,
          service: serviceId,
          endpoint: endpointId,
          applicationBoundaryScope: boundaryScope
        },
        tagFilterExpression: {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: [
            {
              type: 'TAG_FILTER',
              name: boundaryScope === 'INBOUND' ? 'boundary.application.id' : 'application.id',
              stringValue: applicationId,
              operator: operators.EQUALS
            },
            {
              type: 'TAG_FILTER',
              name: 'service.id',
              stringValue: serviceId,
              operator: operators.EQUALS
            },
            {
              type: 'TAG_FILTER',
              name: 'endpoint.id',
              stringValue: endpointId,
              operator: operators.EQUALS
            }
          ]
            .filter(e => e.stringValue)
            .concat([
              {
                type: 'TAG_FILTER',
                name: 'call.is_synthetic',
                booleanValue: includeSyntheticCalls || false,
                operator: operators.EQUALS
              }
            ])
        }
      })}
      selectionMenuItems={[
        {
          name: 'analyze',
          icon: 'lib_analyze',
          label: 'View in Analyze',
          getHref$: () =>
            getJumpToAnalyzeHref$(
              { applicationId: applicationId, serviceId: serviceId, endpointId: endpointId },
              {
                timeConfig: fixateTimeConfig(timeConfig),
                boundaryScope,
                groupByTag: {},
                filters: filterForLink(),
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
    />
  );
}
