/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import { AggregationType, ResultType } from '@instana/types';

// @ts-expect-error
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';
import { andQuery, tagEquals } from 'in-kubernetes/Dashboards/commonComponents/LogsChartInteractionWrapper';
import { metricKey, comparisonMetricKey } from 'in-kubernetes/components/MultiMetricBigNumberKpiCard';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { GetBigNumberKpiCardResult } from 'in-kubernetes/components/GetBigNumberKpiCardResult';
import { blue } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { Config } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { successObservable } from 'in-services/util/result';
import { plugins } from 'in-forge/constants';

jest.mock('in-subscription/getUnifiedMetrics');

const timeShift = { offset: 1 };
const type = plugins.kubernetesNamespace;

const snapshotId = 'XX_XXXXXXXXXXXXXXXXXXXXXXXXX';
const clusterTagId = tagEquals('id.kubernetesCluster', snapshotId);
const tagFilterExpression = toBackendQueryModel(andQuery(clusterTagId));
const timeConfig = {
  windowSize: 1,
  to: 2,
  focusedMoment: 3,
  autoRefresh: false
};

describe('GetBigNumberKpiCardResult', () => {
  beforeEach(jest.clearAllMocks);

  it('getUnifiedMetrics to be called with config with timeshift present', () => {
    const config: Config<any> = {
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
            entity: 'NOT_APPLICABLE',
            name: 'id.kubernetesCluster',
            operator: 'EQUALS',
            type: 'TAG_FILTER',
            value: 'XX_XXXXXXXXXXXXXXXXXXXXXXXXX'
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
            entity: 'NOT_APPLICABLE',
            name: 'id.kubernetesCluster',
            operator: 'EQUALS',
            type: 'TAG_FILTER',
            value: 'XX_XXXXXXXXXXXXXXXXXXXXXXXXX'
          },
          timeConfig: { autoRefresh: false, focusedMoment: 3, to: 2, windowSize: 1 },
          timeShift: { offset: 1 },
          type: 'kubernetesNamespace'
        }
      }
    });
  });
});
