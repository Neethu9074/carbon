/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import ServiceInformation from 'in-applications/ApplicationMap/components/Tooltips/ServiceInformation/ServiceInformation';
import ApplicationMapTooltip from 'in-applications/ApplicationMap/components/Tooltips/ApplicationMapTootlip';
import Header from 'in-applications/ApplicationMap/components/Tooltips/ServiceInformation/Header';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function ServerServiceInformation(props) {
  if (props.isExternalService) {
    return <ApplicationMapTooltip renderHeader={() => <Header service={props.service} />} />;
  }

  return <ServerServiceInformationContent {...props} />;
}

function ServerServiceInformationContent(props) {
  const { applicationId, serviceId } = props;
  const timeConfig = useTimeConfig();
  const metricsResult = useApplicationMetrics({ timeConfig, applicationId, serviceId });

  const serviceInformationProps = {
    ...props,
    timeConfig,
    metricsResult
  };

  return <ServiceInformation {...serviceInformationProps} />;
}

function useApplicationMetrics({ timeConfig, applicationId, serviceId }) {
  const granularity = getSparkChartGranularity(timeConfig);
  const metricsResult =
    useObservable(
      getApplicationMetrics({
        tagFilterExpression: toBackendQueryModel(
          joinExpressions({
            expressions: [
              tagFilter('application.id', EQUALS, applicationId, null, DESTINATION),
              tagFilter('service.id', EQUALS, serviceId, null, DESTINATION)
            ]
          })
        ),
        includeInternal: false,
        includeSynthetic: false,
        timeShift: { offset: 0 },
        timeConfig,
        metrics: {
          calls: {
            metric: 'calls',
            aggregation: 'SUM',
            granularity
          },
          errors: {
            metric: 'errors',
            aggregation: 'MEAN',
            granularity
          },
          latency: {
            metric: 'latency',
            aggregation: 'MEAN',
            granularity
          },
          callsAgg: {
            metric: 'calls',
            aggregation: 'SUM'
          },
          latencyAgg: {
            metric: 'latency',
            aggregation: 'MEAN'
          },
          errorsAgg: {
            metric: 'errors',
            aggregation: 'MEAN'
          }
        }
      }),
      []
    ) ?? pendingResult;

  return metricsResult;
}
