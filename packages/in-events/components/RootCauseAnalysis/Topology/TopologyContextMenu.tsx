/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get, isEmpty } from 'lodash';
import React from 'react';

import { CarbonMenuItemDivider, Collapsible, Stack, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

// import EventsDatagrid from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid';
import getEntityHealthInfo from 'in-kubernetes/subscriptions/getEntityHealthInfo';
import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import { createTagFilterExpressionForAnalysisOfApplicationSA } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
//@ts-expect-error
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { QualifiedRCAEntityTypes } from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import { convertEventsToRawEvents } from 'in-events/components/RootCauseAnalysis/Topology/utils/convertEventToRawEvent';
import getHealthInfoQueryParams from 'in-events/components/RootCauseAnalysis/Topology/utils/getHealthInfoQueryParams';
import { getAPMetricsObservable, getLegacyAPMetricsObservable } from 'in-events/components/legacy/TopologyUtils';
import getApplicationEntityHealthInfo from 'in-applications/subscriptions/getApplicationEntityHealthInfo';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import EventsDatagrid from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid';
import { TopologyGraphNode } from 'in-events/components/RootCauseAnalysis/Topology/types';
import { meanLatency, number, percentage } from 'in-services/formatters/number';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { EntityHealthInfo, Result, TimeConfig } from 'in-types';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { getColor } from 'in-applications/endpointTypes';
import SparkChart from 'in-components/SparkChart';

import locals from './RootCauseMap.mless';

interface TopologyContextMenuProps {
  node: TopologyGraphNode;
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

function getIssueLabel(count: number): string {
  if (count === 0) {
    return t('in-components:health.noIssues');
  }

  return t('in-components:health.openIssues', {
    count
  });
}

const TopologyContextMenu = ({ node }: TopologyContextMenuProps) => {
  const { entityType, id } = node;
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

  const healthInfoQuery =
    node?.entityType === 'infrastructure' || node?.entityType === 'process'
      ? getEntityHealthInfo({ snapshotId: node?.id, timeConfig })
      : getApplicationEntityHealthInfo(getHealthInfoQueryParams(entityType, id, timeConfig));

  const healthInfo = useObservable<Result<EntityHealthInfo>, any[]>(healthInfoQuery, [node]);

  return (
    <React.Fragment>
      <div className={locals.popoverMainContentTopology}>
        <Stack gap="xsmall">
          <Stack direction="horizontal" gap="disabled">
            {badgeTypes?.length > 0 && <BadgeList type="" types={badgeTypes} getColor={getColor} limit={2} />}
            {technologies?.length > 0 && <TechnologyIndicatorList limit={2} technologies={technologies} />}
          </Stack>
          {realTimeMetrics && <MetricDisplay metricResult={realTimeMetrics} timeConfig={timeConfig} />}
        </Stack>
      </div>
      <CarbonMenuItemDivider />
      <Collapsible initiallyOpen={!isEmpty(healthInfo?.data?.openIssues)}>
        <Collapsible.Header>{getIssueLabel(healthInfo?.data?.openIssues.length || 0)}</Collapsible.Header>
        <Collapsible.Content>
          {!isEmpty(healthInfo?.data?.openIssues) && (
            <EventsDatagrid
              headers={['severity', 'problem.problemText']}
              events={convertEventsToRawEvents(healthInfo?.data?.openIssues) || []}
              loading={healthInfo?.progress.loading || false}
              canLoadMore={false}
              loadMore={() => {}}
              showExpand={false}
            />
          )}
        </Collapsible.Content>
      </Collapsible>
    </React.Fragment>
  );
};

export default TopologyContextMenu;
