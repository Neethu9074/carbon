/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import { AggregationType, ResultType } from '@instana/types';

import {
  kubernetesClusterTagEquals,
  andQuery,
  kubernetesNamespaceTagEquals
} from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
// @ts-expect-error
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import { metricKey, comparisonMetricKey } from 'in-kubernetes/components/MultiMetricBigNumberKpiCard';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { Config } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { GetBigNumberKpiCardResult } from './GetBigNumberKpiCardResult';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { successObservable } from 'in-services/util/result';
import { plugins } from 'in-forge/constants';
// import { renderHook } from '@testing-library/react-hooks';
// import { Result } from 'in-types';

jest.mock('in-subscription/getUnifiedMetrics');

const timeShift = { offset: 1 };
const type = plugins.kubernetesNamespace;
const clusterTag = kubernetesClusterTagEquals('clusterName');
const nsTag = kubernetesNamespaceTagEquals('label');
const tagFilterExpression = toBackendQueryModel(andQuery(clusterTag, nsTag));
const timeConfig = {
  windowSize: 1,
  to: 2,
  focusedMoment: 3,
  autoRefresh: false
};

fdescribe('GetBigNumberKpiCardResult', () => {
  beforeEach(jest.clearAllMocks);

  it('getUnifiedMetrics to be called with config with timeshift present', () => {
    const config: Config = {
      metricConfiguration: {
        metric: 'cpuLimits',
        source,
        type,
        aggregation: 'MEAN' as AggregationType,
        tagFilterExpression,
        timeConfig,
        timeShift,
        resultType: 'SINGLE_NUMBER' as ResultType
      },
      comparisonDecreaseColor: blue.id,
      comparisonIncreaseColor: blue.id
    };
    // @ts-expect-error
    getUnifiedMetrics.mockReturnValue(
      successObservable([
        {
          id: metricKey,
          values: [[Date.now(), 45]]
        },
        {
          id: comparisonMetricKey,
          values: [[Date.now(), 42]]
        }
      ])
    );

    renderHook(() => GetBigNumberKpiCardResult({ config }));

    expect(getUnifiedMetrics).toHaveBeenLastCalledWith({
      metrics: {
        bigNumber: {
          aggregation: 'MEAN',
          metric: 'cpuLimits',
          resultType: 'SINGLE_NUMBER',
          source: 'INFRASTRUCTURE_METRICS',
          tagFilterExpression: {
            elements: [
              {
                entity: 'NOT_APPLICABLE',
                name: 'kubernetes.cluster.name',
                operator: 'EQUALS',
                type: 'TAG_FILTER',
                value: 'clusterName'
              },
              {
                entity: 'NOT_APPLICABLE',
                name: 'kubernetes.namespace.name',
                operator: 'EQUALS',
                type: 'TAG_FILTER',
                value: 'label'
              }
            ],
            logicalOperator: 'AND',
            type: 'EXPRESSION'
          },
          timeConfig: { autoRefresh: false, focusedMoment: 3, to: 2, windowSize: 1 },
          timeShift: { offset: 0 },
          type: 'kubernetesNamespace'
        },
        comparison: {
          aggregation: 'MEAN',
          metric: 'cpuLimits',
          resultType: 'SINGLE_NUMBER',
          source: 'INFRASTRUCTURE_METRICS',
          tagFilterExpression: {
            elements: [
              {
                entity: 'NOT_APPLICABLE',
                name: 'kubernetes.cluster.name',
                operator: 'EQUALS',
                type: 'TAG_FILTER',
                value: 'clusterName'
              },
              {
                entity: 'NOT_APPLICABLE',
                name: 'kubernetes.namespace.name',
                operator: 'EQUALS',
                type: 'TAG_FILTER',
                value: 'label'
              }
            ],
            logicalOperator: 'AND',
            type: 'EXPRESSION'
          },
          timeConfig: { autoRefresh: false, focusedMoment: 3, to: 2, windowSize: 1 },
          timeShift: { offset: 1 },
          type: 'kubernetesNamespace'
        }
      }
    });
  });
  fit('getUnifiedMetrics to be called with config with companionMetricConfiguration', () => {
    const config = {
      metricConfiguration: {
        metric: 'cpuLimits',
        source,
        type,
        aggregation: 'MEAN' as AggregationType,
        tagFilterExpression,
        timeConfig,
        timeShift,
        resultType: 'SINGLE_NUMBER' as ResultType
      },
      companionMetricConfiguration: {
        metric: 'cpuRequest',
        source,
        type,
        aggregation: 'MEAN' as AggregationType,
        tagFilterExpression,
        timeConfig,
        timeShift,
        resultType: 'SINGLE_NUMBER' as ResultType
      },
      comparisonDecreaseColor: blue.id,
      comparisonIncreaseColor: blue.id
    };

    // @ts-expect-error
    getUnifiedMetrics.mockReturnValue(
      successObservable([
        {
          id: metricKey,
          values: [[Date.now(), 45]]
        },
        {
          id: comparisonMetricKey,
          values: [[Date.now(), 42]]
        }
      ])
    );

    renderHook(() => GetBigNumberKpiCardResult({ config }));

    expect(getUnifiedMetrics).toHaveBeenLastCalledWith({
      metrics: {
        bigNumber: {
          aggregation: 'MEAN',
          metric: 'cpuLimits',
          resultType: 'SINGLE_NUMBER',
          source: 'INFRASTRUCTURE_METRICS',
          tagFilterExpression: {
            elements: [
              {
                entity: 'NOT_APPLICABLE',
                name: 'kubernetes.cluster.name',
                operator: 'EQUALS',
                type: 'TAG_FILTER',
                value: 'clusterName'
              },
              {
                entity: 'NOT_APPLICABLE',
                name: 'kubernetes.namespace.name',
                operator: 'EQUALS',
                type: 'TAG_FILTER',
                value: 'label'
              }
            ],
            logicalOperator: 'AND',
            type: 'EXPRESSION'
          },
          timeConfig: { autoRefresh: false, focusedMoment: 3, to: 2, windowSize: 1 },
          timeShift: { offset: 0 },
          type: 'kubernetesNamespace'
        },
        comparison: {
          aggregation: 'MEAN',
          metric: 'cpuLimits',
          resultType: 'SINGLE_NUMBER',
          source: 'INFRASTRUCTURE_METRICS',
          tagFilterExpression: {
            elements: [
              {
                entity: 'NOT_APPLICABLE',
                name: 'kubernetes.cluster.name',
                operator: 'EQUALS',
                type: 'TAG_FILTER',
                value: 'clusterName'
              },
              {
                entity: 'NOT_APPLICABLE',
                name: 'kubernetes.namespace.name',
                operator: 'EQUALS',
                type: 'TAG_FILTER',
                value: 'label'
              }
            ],
            logicalOperator: 'AND',
            type: 'EXPRESSION'
          },
          timeConfig: { autoRefresh: false, focusedMoment: 3, to: 2, windowSize: 1 },
          timeShift: { offset: 1 },
          type: 'kubernetesNamespace'
        }
      }
    });
  });
});
