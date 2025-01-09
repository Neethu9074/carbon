/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInformation from 'in-applications/ApplicationMap/components/Tooltips/ServiceInformation/ServiceInformation';
import ApplicationMapTootlip from 'in-applications/ApplicationMap/components/Tooltips/ApplicationMapTootlip';
import Header from 'in-applications/ApplicationMap/components/Tooltips/ServiceInformation/Header';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    if (props.isExternalService) {
      return {};
    }
    return {
      timeConfig: timeConfig$,
      metricsResult: timeConfig$.flatMap(timeConfig => {
        const granularity = getSparkChartGranularity(timeConfig);
        return getApplicationMetrics({
          tagFilterExpression: toBackendQueryModel(
            joinExpressions({
              expressions: [
                tagFilter('application.id', EQUALS, props.applicationId, null, DESTINATION),
                tagFilter('service.id', EQUALS, props.serviceId, null, DESTINATION)
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
        });
      })
    };
  },
  function ServerServiceInformation(props) {
    if (!props.metricsResult) {
      if (props.isExternalService) {
        return <ApplicationMapTootlip renderHeader={() => <Header service={props.service} />} />;
      }
      return null;
    }

    return <ServiceInformation {...props} />;
  }
);
