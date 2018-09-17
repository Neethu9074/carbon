import React from 'react';

import ServiceInformation from 'in-new-components/ApplicationMap/components/Tooltips/ServiceInformation/ServiceInformation';
import ApplicationMapTootlip from 'in-new-components/ApplicationMap/components/Tooltips/ApplicationMapTootlip';
import Header from 'in-new-components/ApplicationMap/components/Tooltips/ServiceInformation/Header';
import { getSparkChartGranularity } from 'in-applications/metrics';
import getMetrics from 'in-subscription/application/getMetrics';
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
        return getMetrics({
          filter: {
            application: props.applicationId,
            service: props.serviceId,
            timeConfig
          },
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
