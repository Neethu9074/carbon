/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  TimeConfig,
  isApplicationSloEntity,
  isTimeBasedSli,
  ApplicationSloEntity,
  WebsiteSloEntity,
  isWebsiteSloEntity,
  BlueprintType,
  AggregationType,
  Group,
  BeaconType,
  ServiceLevelIndicatorUnion,
  TagFilterExpression,
  SloEntityUnion
} from '@instana/types';

import {
  analyzePathFullyQualified as websiteAnalyzePathFullyQualified,
  analyzePath as websiteAnalyzePath
} from 'in-websites/navigation/paths';
import {
  ChartMetric,
  createChartedMetric,
  createGroupBy,
  createMetricField,
  MetricField
} from 'in-analyze/navigation/paths';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import { setOrDeleteMatrixKey, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { toSimplifiedFormModelElements } from 'in-service-levels/utils/tagFilter';
import { analyze as applicationAnalyzePath } from 'in-analyze/navigation/paths';
import { hiddenCallsMatrixParameter } from 'in-applications/navigation/matrix';
import { Location, ParameterDefinition } from 'in-stores/navigation/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { createParameters } from 'in-components/AnalyzeView/parameters';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { entityTypes } from 'in-analyze/applicationFilter';
import { setTimeConfig } from 'in-stores/time/config';

interface UseHrefToUnboundedAnalyticsProps {
  indicator: ServiceLevelIndicatorUnion;
  entity: SloEntityUnion;
  timeConfig: TimeConfig;
  withLabels?: boolean;
}

export default function useHrefToUnboundedAnalytics({
  indicator,
  entity,
  timeConfig,
  withLabels
}: UseHrefToUnboundedAnalyticsProps): string | undefined {
  const { location, createHref } = useNavigation();
  const tagFilterExpression = useBasicTagFilterExpression({ entity, withLabels });

  const analyticsLocation = getLocationToUnboundedAnalytics({
    location,
    indicator,
    entity,
    timeConfig,
    tagFilterExpression
  });

  return createHref(analyticsLocation);
}

interface UseLocationToUnboundedAnalyticsProps {
  location: Location;
  indicator: ServiceLevelIndicatorUnion;
  entity: SloEntityUnion;
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
}

function getLocationToUnboundedAnalytics({
  location,
  indicator,
  entity,
  timeConfig,
  tagFilterExpression
}: UseLocationToUnboundedAnalyticsProps): Location {
  const { blueprint } = indicator;

  if (isApplicationSloEntity(entity)) {
    return getApplicationEntityHref({
      entity,
      blueprint,
      timeConfig,
      tagFilterExpression,
      location
    });
  }

  if (isWebsiteSloEntity(entity)) {
    return getWebsiteEntityHref({
      entity,
      indicator,
      blueprint,
      timeConfig,
      tagFilterExpression,
      location
    });
  }

  // This case should never happen, but if it does, something nasty is going on and
  // this exception will let us know about it.
  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

interface NavigationType {
  location: Location;
}

interface BaseGenerateHrefProps extends NavigationType {
  tagFilterExpression: TagFilterExpression;
  blueprint: BlueprintType;
  timeConfig: TimeConfig;
}

interface GetApplicationSloHrefProps extends BaseGenerateHrefProps {
  entity: ApplicationSloEntity;
}

function getApplicationEntityHref({
  location,
  entity,
  blueprint,
  tagFilterExpression,
  timeConfig
}: GetApplicationSloHrefProps): Location {
  const analyzeParameters = createParameters(applicationAnalyzePath);

  return updateLocationForApplicationEntity({
    location,
    entity,
    blueprint,
    timeConfig,
    tagFilterExpression,
    analyzeParameters
  });
}

interface GetWebsiteSloHrefProps extends BaseGenerateHrefProps {
  entity: WebsiteSloEntity;
  indicator: ServiceLevelIndicatorUnion;
}

function getWebsiteEntityHref({
  location,
  entity,
  indicator,
  blueprint,
  timeConfig,
  tagFilterExpression
}: GetWebsiteSloHrefProps): Location {
  const { beaconType } = entity;
  const aggregation = isTimeBasedSli(indicator) ? indicator.aggregation : 'MEAN';
  const analyzeParameters = createParameters(websiteAnalyzePath);

  return updateLocationForWebsiteEntity({
    aggregation,
    analyzeParameters,
    blueprint,
    beaconType,
    location,
    tagFilterExpression,
    timeConfig
  });
}

const applicationChartMetrics: Record<BlueprintType, [string, string]> = Object.freeze({
  latency: ['latency', 'DISTRIBUTION'],
  availability: ['calls', 'SUM']
});

interface UpdateLocationForEntityProps {
  location: Location;
  timeConfig?: TimeConfig;
  blueprint: BlueprintType;
  tagFilterExpression: TagFilterExpression;
  analyzeParameters: ReturnType<typeof createParameters>;
}

interface UpdateLocationForApplicationEntityProps extends UpdateLocationForEntityProps {
  entity: ApplicationSloEntity;
}

function updateLocationForApplicationEntity({
  location,
  entity,
  blueprint,
  timeConfig,
  tagFilterExpression,
  analyzeParameters
}: UpdateLocationForApplicationEntityProps): Location {
  const { includeInternal, includeSynthetic, endpointId } = entity;

  const hasEndpoint = endpointId !== undefined;
  const groupbyTag = hasEndpoint ? 'endpoint.name' : 'service.name';
  const groupBy = createGroupBy(groupbyTag, entityTypes.DESTINATION);
  const chartedMetrics = [createChartedMetric(...applicationChartMetrics[blueprint])];

  const newLocation = setDefaultMatrixParameter({
    location,
    groupBy,
    chartedMetrics,
    timeConfig,
    analyzeParameters,
    tagFilterExpression,
    analyzePath: applicationAnalyzePath
  });
  setOrDeleteMatrixParameter(newLocation, hiddenCallsMatrixParameter, { includeInternal, includeSynthetic });

  return newLocation;
}

interface UpdateLocationForWebsiteEntityProps extends UpdateLocationForEntityProps {
  aggregation: AggregationType;
  beaconType: BeaconType;
}

function updateLocationForWebsiteEntity({
  location,
  aggregation,
  blueprint,
  timeConfig,
  beaconType,
  tagFilterExpression,
  analyzeParameters
}: UpdateLocationForWebsiteEntityProps): Location {
  const isLatencyBlueprint = blueprint === 'latency';
  const metricId = isLatencyBlueprint ? 'beaconDuration' : 'beaconErrorRate';
  const chartedMetrics = [createChartedMetric(metricId, aggregation)];
  const fields = [createMetricField(metricId, aggregation)];
  const groupBy = createGroupBy('beacon.location.url');

  const newLocation = setDefaultMatrixParameter({
    location,
    groupBy,
    fields,
    chartedMetrics,
    timeConfig,
    tagFilterExpression,
    analyzeParameters,
    analyzePath: websiteAnalyzePathFullyQualified
  });
  setOrDeleteMatrixKey(newLocation, websiteAnalyzePath, 'beaconType', beaconType);

  return newLocation;
}

type TagFilterExpressionParameters = ParameterDefinition<FormModelElement[] | []>;

interface SetDefaultMatrixParameterProps {
  location: Location;
  timeConfig?: TimeConfig;
  groupBy?: Partial<Group>;
  fields?: Array<MetricField>;
  chartedMetrics?: Array<ChartMetric>;
  tagFilterExpression: TagFilterExpression;
  analyzePath: string;
  analyzeParameters: ReturnType<typeof createParameters>;
}

function setDefaultMatrixParameter({
  location,
  timeConfig,
  groupBy,
  fields,
  chartedMetrics,
  tagFilterExpression,
  analyzePath,
  analyzeParameters
}: SetDefaultMatrixParameterProps): Location {
  const newLocation = { ...location, pathname: analyzePath };

  if (timeConfig) setTimeConfig(location, timeConfig);
  setOrDeleteMatrixParameter(newLocation, analyzeParameters.groupBy, groupBy);
  setOrDeleteMatrixParameter(newLocation, analyzeParameters.orderByGroups);
  setOrDeleteMatrixParameter(newLocation, analyzeParameters.fields, fields);
  setOrDeleteMatrixParameter(newLocation, analyzeParameters.chartedMetrics, chartedMetrics);
  setOrDeleteMatrixParameter(
    newLocation,
    analyzeParameters.tagFilterExpression as TagFilterExpressionParameters,
    toSimplifiedFormModelElements(tagFilterExpression)
  );

  return newLocation;
}
