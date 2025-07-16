/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';
import { get } from 'lodash';

import { Stack, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import { createTagFilterExpressionForAnalysisOfApplicationSA } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import { QualifiedRCAEntityTypes } from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import getHealthInfoQueryParams from 'in-events/components/RootCauseAnalysis/Topology/utils/getHealthInfoQueryParams';
import { getAPMetricsObservable, getLegacyAPMetricsObservable } from 'in-events/components/legacy/TopologyUtils';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { meanLatency, number, percentage } from 'in-services/formatters/number';
import { getSparkChartGranularity } from 'in-applications/metrics';
import SparkChart from 'in-components/SparkChart';
import { TimeConfig } from 'in-types';

import locals from './MetricsSection.mless';

interface SparkChartWithMetricProps {
  title: string;
  rollup: number;
  timeConfig: TimeConfig;
  aggregation: string;
  metrics: any;
  metric: any;
  tooltipFormatter: (v: number | null | undefined) => string;
}

function SparkChartWithMetric(props: SparkChartWithMetricProps) {
  const { title, metric, tooltipFormatter } = props;
  return (
    <div>
      <h3>{title}</h3>
      <SparkChart
        {...props}
        verticalMetricValue={metric && metric.length > 0 ? tooltipFormatter(metric[0][1]) : null}
      />
    </div>
  );
}

function MetricDisplay({ metricResult, timeConfig }: { metricResult: any; timeConfig: TimeConfig | null }) {
  if (!timeConfig) return null;

  const rollup = getSparkChartGranularity(timeConfig);

  return (
    <Stack direction="horizontal" distribution="spaceEvenly" align="start">
      <SparkChartWithMetric
        title={t('in-applications:titleTotalCalls')}
        rollup={rollup}
        timeConfig={timeConfig}
        aggregation="SUM"
        metrics={get(metricResult, ['calls'])}
        metric={get(metricResult, ['callsAgg'])}
        tooltipFormatter={v => (v ? number.compact(v) : number.compact(0))}
      />
      <SparkChartWithMetric
        title={t('in-applications:titleErroneousCalls')}
        rollup={rollup}
        timeConfig={timeConfig}
        aggregation="MEAN"
        metrics={get(metricResult, ['errors'])}
        metric={get(metricResult, ['errorsAgg'])}
        tooltipFormatter={v => (v ? percentage.compact(v) : percentage.compact(0))}
      />
      <SparkChartWithMetric
        title={t('in-applications:titleAvgLatency')}
        rollup={rollup}
        timeConfig={timeConfig}
        aggregation="MEAN"
        metrics={get(metricResult, ['latency'])}
        metric={get(metricResult, ['latencyAgg'])}
        tooltipFormatter={v => (v ? meanLatency.compact(v) : meanLatency.compact(0))}
      />
    </Stack>
  );
}

const MetricsSection = () => {
  const { selectedEntityId } = useEntitySelection();
  const { rootCauses } = useContext(RootCauseDataContext);
  const rootCauseIndex = rootCauses.findIndex(rc => rc.entityData?.id === selectedEntityId);

  const { entityType } = rootCauses[rootCauseIndex] ?? '';
  const id = rootCauses[rootCauseIndex]?.entityData?.id ?? '';
  const label = rootCauses[rootCauseIndex]?.entityData?.label ?? '';

  const { timeConfig, relatedAPInfo } = useRootCauseTopologyDataContext();
  const relatedAP = relatedAPInfo || null;

  // If timeConfig is null, we can't proceed with metrics
  if (!timeConfig) {
    return (
      <React.Fragment>
        <div className={locals.popoverMainContentTopology}>
          <Typography variant="body-01">Time configuration not available</Typography>
        </div>
      </React.Fragment>
    );
  }

  // TODO: convert the data conversion to a hook
  const filterFormModel = createTagFilterExpressionForAnalysisOfApplicationSA(
    entityType as QualifiedRCAEntityTypes,
    id,
    null,
    relatedAP ? relatedAP.label : null,
    entityType === 'endpoint' ? label : null
  );

  const tagFilterExpression = toBackendQueryModel(filterFormModel);

  const legacyMetricsParams = getHealthInfoQueryParams(entityType, id, timeConfig);

  const realTimeMetrics = useObservable(
    entityType === 'infrastructure'
      ? getAPMetricsObservable(tagFilterExpression, timeConfig)
      : getLegacyAPMetricsObservable({
          applicationId: legacyMetricsParams.applicationId || '',
          serviceId: legacyMetricsParams.serviceId,
          endpointId: legacyMetricsParams.endpointId,
          timeConfig
        }),
    [entityType]
  );

  return (
    <div className={locals.metricsCection}>
      <Typography variant="body-bold">{t('in-events:titleMetrics')}</Typography>
      {realTimeMetrics ? <MetricDisplay metricResult={realTimeMetrics} timeConfig={timeConfig} /> : <></>}
    </div>
  );
};

export default MetricsSection;
