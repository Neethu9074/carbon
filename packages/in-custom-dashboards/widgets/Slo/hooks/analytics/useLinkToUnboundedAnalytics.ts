/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { just, Observable } from '@instana/observables';

import {
  ApplicationSliEntity,
  AvailabilitySliEntity,
  SliConfiguration,
  TagCatalog,
  TagFilter,
  TimeConfig,
  WebsiteEventBasedSliEntity,
  WebsiteTimeBasedSliEntity
} from 'in-types';
import {
  isApplicationSliConfig,
  isAvailabilitySliConfig,
  isWebsiteEventBasedSliConfig,
  isWebsiteTimeBasedSliConfig,
  SliConfig
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import getJumpDirectlyToApplicationLikeUA2Href$ from 'in-custom-dashboards/widgets/Slo/hooks/analytics/getJumpDirectlyToApplicationLikeUA2Href';
import getLinkToWebsiteAnalyze from 'in-custom-dashboards/widgets/Slo/hooks/analytics/getLinkToWebsiteAnalyze';
import { getEmptyTagFilterExpression } from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { tagFilter, toNewTagFilterFormat } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS, GREATER_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import { TimeConfigAwareHref$Creator } from 'in-components/Chart/types';
import { createChartedMetric } from 'in-analyze/navigation/paths';
import { ChartedMetric } from 'in-applications/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';

export function useLinkToUnboundedAnalytics(
  sliConfig: SliConfiguration | undefined,
  tagCatalog: TagCatalog | undefined
): TimeConfigAwareHref$Creator {
  if (!sliConfig || !tagCatalog) {
    return () => just('');
  }

  if (isAvailabilitySliConfig(sliConfig)) {
    return highlightedTime => buildAvailabilitySliEntityUA2Link(sliConfig, highlightedTime);
  }

  if (isApplicationSliConfig(sliConfig)) {
    return highlightedTime => buildApplicationSliEntityUA2Link(sliConfig, tagCatalog, highlightedTime);
  }

  if (isWebsiteTimeBasedSliConfig(sliConfig)) {
    return highlightedTime => buildWebsiteTimeBaseSliEntityUA2Link(sliConfig, tagCatalog, highlightedTime);
  }

  if (isWebsiteEventBasedSliConfig(sliConfig)) {
    return highlightedTime => buildWebsiteEventBasedSliEntityUA2Link(sliConfig, tagCatalog, highlightedTime);
  }

  return () => just('');
}

function buildAvailabilitySliEntityUA2Link(sliConfig: SliConfig<AvailabilitySliEntity>, highlightedTime: TimeConfig) {
  const {
    boundaryScope,
    includeInternal,
    includeSynthetic,
    badEventFilterExpression = getEmptyTagFilterExpression(),
    ...remainingSliEntityProps
  } = sliConfig.sliEntity;

  const additionalParams = {
    timeConfig: highlightedTime,
    groupBy: getGroupByParam(remainingSliEntityProps),
    hiddenCalls: { includeInternal, includeSynthetic },
    chartedMetrics: getChartsParam(sliConfig)
  } as const;

  return getJumpDirectlyToApplicationLikeUA2Href$(
    remainingSliEntityProps,
    badEventFilterExpression,
    [],
    boundaryScope,
    additionalParams
  );
}

function buildApplicationSliEntityUA2Link(
  sliConfig: SliConfig<ApplicationSliEntity>,
  tagCatalog: TagCatalog,
  highlightedTime: TimeConfig
): Observable<string> {
  const filters = getAdditionalFiltersForApplicationSli(sliConfig);
  const { boundaryScope, ...remainingSliEntityProps } = sliConfig.sliEntity;

  const additionalParams = {
    timeConfig: highlightedTime,
    groupBy: getGroupByParam(remainingSliEntityProps),
    chartedMetrics: getChartsParam(sliConfig)
  };

  return getJumpDirectlyToApplicationLikeUA2Href$(
    remainingSliEntityProps,
    getEmptyTagFilterExpression(),
    filters.map(f => toNewTagFilterFormat(f, tagCatalog)),
    boundaryScope,
    additionalParams
  );
}

function buildWebsiteTimeBaseSliEntityUA2Link(
  sliConfig: SliConfig<WebsiteTimeBasedSliEntity>,
  tagCatalog?: TagCatalog,
  timeConfig?: TimeConfig
): Observable<string> {
  const { sliEntity, metricConfiguration } = sliConfig;
  const { beaconType, websiteId, filterExpression } = sliEntity;

  const hasValidMetricConfig = metricConfiguration?.metricName && metricConfiguration?.metricAggregation;

  const websiteAnalyzeProps = {
    websiteId: websiteId!,
    beaconType,
    tagCatalog,
    timeConfig,
    filterExpression
  };

  if (!hasValidMetricConfig) return getLinkToWebsiteAnalyze(websiteAnalyzeProps);

  const filterMetric = {
    metricId: metricConfiguration.metricName,
    aggregationId: metricConfiguration.metricAggregation
  };

  return getLinkToWebsiteAnalyze({
    ...websiteAnalyzeProps,
    chartedMetrics: [filterMetric],
    fields: [{ ...filterMetric, type: 'metric' }]
  });
}

function buildWebsiteEventBasedSliEntityUA2Link(
  sliConfig: SliConfig<WebsiteEventBasedSliEntity>,
  tagCatalog?: TagCatalog,
  timeConfig?: TimeConfig
): Observable<string> {
  const { sliEntity } = sliConfig;
  const { beaconType, websiteId, badEventFilterExpression } = sliEntity;

  return getLinkToWebsiteAnalyze({
    websiteId: websiteId!,
    beaconType,
    tagCatalog,
    timeConfig,
    filterExpression: badEventFilterExpression
  });
}

interface EntityIds {
  readonly applicationId?: string;
  readonly serviceId?: string;
  readonly endpointId?: string;
}
function getGroupByParam(enityIds: EntityIds) {
  const groupbyTag = enityIds.serviceId == null && enityIds.endpointId == null ? 'service.name' : 'endpoint.name';
  return {
    groupbyTagEntity: entityTypes.DESTINATION,
    groupbyTag
  };
}

function getChartsParam(sliConfig: SliConfiguration): ChartedMetric[] {
  if (isApplicationSliConfig(sliConfig)) {
    const metricName = sliConfig.metricConfiguration?.metricName;
    if (metricName === 'latency') {
      return [createChartedMetric('latency', 'DISTRIBUTION')];
    }
  }
  return [createChartedMetric('calls', 'SUM')];
}

function getAdditionalFiltersForApplicationSli(sliConfig: SliConfig<ApplicationSliEntity>): [] | TagFilter[] {
  const { metricConfiguration } = sliConfig;

  switch (metricConfiguration?.metricName) {
    case 'latency': {
      const thresholdValue = metricConfiguration.threshold;
      return [tagFilter('call.latency', GREATER_THAN, thresholdValue)];
    }
    case 'errors':
    case 'erroneousCalls':
      return [tagFilter('call.erroneous', EQUALS, true)];
    case 'calls':
    default:
      // no filter to add
      return [];
  }
}
