import { compose, withProps } from 'recompose';
import React from 'react';

import { beaconType as beaconTypeMatrixParameter } from 'in-websites/navigation/matrix';
import {
  groupedBeaconsMetricsUrlParameter,
  groupedBeaconsOrderByUrlParameter,
  groupedBeaconsOrderDirectionUrlParameter
} from 'in-websites/navigation/urlParameters';
import { availableMetrics, defaultMetrics } from 'in-websites/analyze/AnalyzeView/metrics';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import MetricSelector from 'in-analyze/components/MetricSelector';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { analyzePath } from 'in-websites/navigation/paths';
import { changeAnalyzeMetrics } from 'in-websites/tracker';
import withUrlState from 'in-hoc/withUrlState';

export function createMetricSelectionHocs({ defaultOrderBy, createOrderByMetricName }) {
  return compose(
    withUrlState({
      bind: [
        groupedBeaconsMetricsUrlParameter,
        {
          ...groupedBeaconsOrderByUrlParameter,
          initialState: defaultOrderBy
        },
        {
          ...groupedBeaconsOrderDirectionUrlParameter,
          initialState: 'DESC'
        }
      ],
      reducerName: 'onChange'
    }),
    withProps(({ metrics, location }) => ({
      metrics: metrics || defaultMetrics[getMatrixParameter(location, analyzePath, beaconTypeMatrixParameter)]
    })),
    withProps(({ beaconType, onChange, metrics, orderBy, orderDirection, isGroupedView }) => ({
      availableMetrics: availableMetrics[beaconType],
      onChangeOrder: onChange,
      openMetricSelector: () => {
        setActiveDialog(
          <MetricSelector
            title="Select Metrics"
            help="Select which metrics should be available as columns within the table. It also defines which metrics could be viewed as graphs."
            availableMetrics={availableMetrics[beaconType]}
            selectedMetrics={metrics}
            maximumNumberOfMetrics={5}
            isGroupedView={isGroupedView}
            onSave={metrics => {
              const orderByMetricStillExists = metrics.reduce(
                (agg, { metric, aggregation }) =>
                  agg ||
                  orderBy ===
                    createOrderByMetricName({ metric, aggregation, availableMetrics: availableMetrics[beaconType] }),
                false
              );
              changeAnalyzeMetrics({
                beaconType,
                metrics: JSON.stringify(metrics)
              });
              onChange({
                metrics,
                orderBy: orderByMetricStillExists ? orderBy : defaultOrderBy,
                orderDirection: orderByMetricStillExists ? orderDirection : 'DESC'
              });
            }}
          />
        );
      }
    }))
  );
}
