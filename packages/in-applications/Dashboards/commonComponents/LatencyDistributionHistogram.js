import React, { useState } from 'react';

import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import LatencyDistributionChart from 'in-new-components/LatencyDistributionChart/LatencyDistributionChart';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import getLatencyDistribution from 'in-subscription/application/getLatencyDistribution';
import { latencyDistributionBase10Enabled } from 'in-services/featureFlags';
import getJumpToAnalyzeHref$ from '../../components/getJumpToAnalyzeHref';
import { operators } from 'in-analyze/applicationFilter';

export default function LatencyDistributionHistogram({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  includeSyntheticCalls,
  callType,
  renderPostChartContent
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
    if (callType) {
      filters.push({
        name: 'call.type',
        value: callType,
        operator: 'EQUALS'
      });
    }
    if (includeSyntheticCalls) {
      filters.push({
        name: 'include_synthetic',
        value: 'true'
      });
    }
    return filters;
  };

  if (latencyDistributionBase10Enabled) {
    return (
      <LatencyDistributionBase10Chart
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        boundaryScope={boundaryScope}
        includeSyntheticCalls={includeSyntheticCalls}
        callType={callType}
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
            label: 'View in Analytics',
            getHref$: () =>
              getJumpToAnalyzeHref$(
                { applicationId: applicationId, serviceId: serviceId, endpointId: endpointId },
                {
                  boundaryScope,
                  groupByTag: {},
                  filters: filterForLink(),
                  focusedMetric: 'calls_DISTRIBUTION'
                }
              )
          }
        ]}
        onSelectionChanged={setSelectedLatencyRange}
        showLegend
      />
    );
  }
  return (
    <LatencyDistributionChart
      renderPostChartContent={renderPostChartContent}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      boundaryScope={boundaryScope}
      includeSyntheticCalls={includeSyntheticCalls}
      callType={callType}
      subscription={getLatencyDistribution({
        maxLatencyBuckets: 10,
        filter: {
          timeConfig,
          application: applicationId,
          service: serviceId,
          endpoint: endpointId,
          applicationBoundaryScope: boundaryScope,
          includeSyntheticCalls
        }
      })}
    />
  );
}
