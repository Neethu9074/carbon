/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';
import { get } from 'lodash';

import { CarbonMenuItemDivider, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior/ApplicationEntityHealthIndicatorBehavior';
import {
  RCATopologyAPContext,
  RCATopologyTimeWindowContext
} from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopologyDialog';
import { createTagFilterExpressionForAnalysisOfApplicationSA } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
//@ts-expect-error
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import getHealthInfoQueryParams from 'in-events/components/RootCauseAnalysis/Topology/utils/getHealthInfoQueryParams';
import { getAPMetricsObservable, getLegacyAPMetricsObservable } from 'in-events/components/legacy/TopologyUtils';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
//@ts-expect-error
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import { TopologyGraphNode } from 'in-events/components/RootCauseAnalysis/Topology/types';
import { meanLatency, number, percentage } from 'in-services/formatters/number';
import { getSparkChartGranularity } from 'in-applications/metrics';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { getColor } from 'in-applications/endpointTypes';
import SparkChart from 'in-components/SparkChart';
import { TimeConfig } from 'in-types';

import locals from './RootCauseMap.mless';

interface TopologyContextMenuProps {
  node: TopologyGraphNode;
  healthInfo:
    | {
        openIssues: number | undefined;
        maxSeverity: number | undefined;
      }
    | null
    | undefined;
}

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

function MetricDisplay({ metricResult }: { metricResult: any }) {
  const timeConfig = useContext(RCATopologyTimeWindowContext);
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

const TopologyContextMenu = ({ node, healthInfo }: TopologyContextMenuProps) => {
  const { entityType, id, metadata } = node;
  const timeConfig = useContext(RCATopologyTimeWindowContext) as TimeConfig;
  const relatedAP = useContext(RCATopologyAPContext)[0];

  const filterFormModel = createTagFilterExpressionForAnalysisOfApplicationSA(
    entityType,
    metadata.data,
    id,
    null,
    relatedAP ? relatedAP.label : null,
    node.entityType === 'endpoint' ? node.label : null
  );

  const tagFilterExpression = toBackendQueryModel(filterFormModel);

  const legacyMetricsParams = getHealthInfoQueryParams(entityType, id, timeConfig);

  const realTimeMetrics = useObservable(
    get(node, 'entityType') === 'infrastructure'
      ? getAPMetricsObservable(tagFilterExpression, timeConfig)
      : getLegacyAPMetricsObservable({
          applicationId: legacyMetricsParams.applicationId || '',
          serviceId: legacyMetricsParams.serviceId,
          endpointId: legacyMetricsParams.endpointId,
          timeConfig
        }),
    [node]
  );

  const badgeTypes = get(node, 'metadata.data.endpointTypes', []);
  const technologies = get(node, 'metadata.data.technologies', []);

  return (
    <React.Fragment>
      <div className={locals.popoverMainContentTopology}>
        <Stack gap="xsmall">
          <Stack direction="horizontal" gap="disabled">
            {badgeTypes?.length > 0 && <BadgeList type="" types={badgeTypes} getColor={getColor} limit={2} />}
            {technologies?.length > 0 && <TechnologyIndicatorList limit={2} technologies={technologies} />}
          </Stack>
          {realTimeMetrics && <MetricDisplay metricResult={realTimeMetrics} />}
        </Stack>
      </div>
      <CarbonMenuItemDivider />
      <div className={locals.popoverFooterTopology}>
        <Stack direction="horizontal" gap="small">
          {node.entityType !== 'infrastructure' && (
            <ApplicationEntityHealthIndicatorBehavior
              maxSeverity={healthInfo?.maxSeverity}
              openIssues={healthInfo?.openIssues}
              timeConfig={timeConfig}
              applicationId={entityType === 'application' ? id : ''}
              serviceId={entityType === 'service' ? id : undefined}
              endpointId={entityType === 'endpoint' ? id : undefined}
              IndicatorPresenter={HealthIndicatorButtonPresenter}
            />
          )}

          {entityType === 'infrastructure' && (
            <EntityHealthIndicator
              IndicatorPresenter={(props: any) => <HealthIndicatorButtonPresenter size="normal" {...props} />}
              snapshotId={id}
              timeConfig={timeConfig}
            />
          )}
        </Stack>
      </div>
    </React.Fragment>
  );
};

export default TopologyContextMenu;
