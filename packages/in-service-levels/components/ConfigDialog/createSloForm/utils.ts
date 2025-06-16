/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  ApplicationSloEntity,
  FixedTimeWindow,
  RollingTimeWindow,
  ServiceLevelIndicatorUnion,
  ServiceLevelObjectiveConfiguration,
  SyntheticSloEntity,
  TimeWindow,
  WebsiteSloEntity
} from '@instana/types';

import {
  defaultBeaconType,
  defaultBoundaryScope,
  defaultTrafficType,
  ServiceLevelErrors
} from 'in-service-levels/constants';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { parseDateTime } from 'in-services/formatters/date';

export function formToSloConfiguration(form: SloForm, id?: string): ServiceLevelObjectiveConfiguration {
  return {
    name: form.getIn(['nameTags', 'name']).value,
    tags: form.getIn(['nameTags', 'tags']).value,
    id,
    entity: formToEntity(form),
    indicator: formToIndicator(form),
    timeWindow: {
      duration: form.getIn(['objective', 'duration']).value,
      durationUnit: form.getIn(['objective', 'durationUnit']).value,
      type: form.getIn(['objective', 'type']).value,
      startTimestamp: formToStartTimeStamp(form)
    },
    target: form.getIn(['objective', 'target']).value ?? 0
  };
}

export function formToEntity(form: SloForm): ApplicationSloEntity | WebsiteSloEntity | SyntheticSloEntity {
  const entityType = form.getIn(['entity', 'type']).value;

  if (entityType === 'synthetic') {
    return {
      type: 'synthetic',
      syntheticTestIds: form.getIn(['entity', 'entityIds']).value,
      tagFilterExpression: emptyTagFilterExpression
    };
  }

  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);
  const tagFilterExpression = tagFilterExpressionField.valid
    ? toBackendQueryModel(tagFilterExpressionField.value)
    : emptyTagFilterExpression;

  if (entityType === 'application') {
    return {
      applicationId: form.getIn(['entity', 'entityIds']).value[0],
      boundaryScope: form.getIn(['scope', 'boundaryScope']).value ?? defaultBoundaryScope,
      serviceId: form.getIn(['scope', 'serviceId']).value || undefined,
      endpointId: form.getIn(['scope', 'endpointId']).value || undefined,
      includeInternal: form.getIn(['scope', 'includeInternal']).value,
      includeSynthetic: form.getIn(['scope', 'includeSynthetic']).value,
      tagFilterExpression,
      type: 'application'
    };
  }

  if (entityType === 'website') {
    return {
      websiteId: form.getIn(['entity', 'entityIds']).value[0],
      beaconType: form.getIn(['scope', 'beaconType']).value ?? defaultBeaconType,
      tagFilterExpression,
      type: 'website'
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

export function formToIndicator(form: SloForm): ServiceLevelIndicatorUnion {
  const indicatorType = form.getIn(['indicator', 'type']).value;
  const blueprintType = form.getIn(['indicator', 'blueprint']).value;

  if (blueprintType === 'custom') {
    return {
      goodEventsFilter: toBackendQueryModel(form.getIn(['indicator', 'goodEventsFilter']).value),
      badEventsFilter: toBackendQueryModel(form.getIn(['indicator', 'badEventsFilter']).value),
      threshold: form.getIn(['indicator', 'threshold']).value ?? 0,
      blueprint: 'custom',
      type: 'eventBased'
    };
  }

  if (blueprintType === 'latency' || blueprintType === 'availability') {
    if (indicatorType === 'eventBased') {
      return {
        threshold: form.getIn(['indicator', 'threshold']).value ?? 0,
        blueprint: blueprintType,
        type: 'eventBased'
      };
    }

    if (indicatorType === 'timeBased') {
      return {
        aggregation: form.getIn(['indicator', 'aggregation']).value,
        threshold: form.getIn(['indicator', 'threshold']).value ?? 0,
        blueprint: blueprintType,
        type: 'timeBased'
      };
    }
  }

  if (blueprintType === 'traffic') {
    return {
      aggregation: 'SUM',
      threshold: form.getIn(['indicator', 'threshold']).value ?? 0,
      blueprint: 'traffic',
      type: 'timeBased',
      operator: form.getIn(['indicator', 'operator']).value,
      trafficType: form.getIn(['indicator', 'trafficType']).value ?? defaultTrafficType
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLI_TYPE);
}

export function formToStartTimeStamp(form: SloForm): number {
  const date = form.getIn(['objective', 'startTimestamp', 'date']).value;
  const time = form.getIn(['objective', 'startTimestamp', 'time']).value;
  return parseDateTime(`${date} ${time}`).getTime();
}

export function formToTimeWindow(form: SloForm): TimeWindow | FixedTimeWindow | RollingTimeWindow {
  const duration = form.getIn(['objective', 'duration']).value;
  const durationUnit = form.getIn(['objective', 'durationUnit']).value;
  const type = form.getIn(['objective', 'type']).value;
  const timeWindow = {
    duration,
    durationUnit,
    type
  };

  if (type === 'fixed') {
    const fixedTimeWindow: FixedTimeWindow = {
      ...timeWindow,
      type,
      startTimestamp: formToStartTimeStamp(form)
    };
    return fixedTimeWindow;
  }

  if (type === 'rolling') {
    const rollingTimeWindow: RollingTimeWindow = {
      ...timeWindow,
      type
    };
    return rollingTimeWindow;
  }

  return timeWindow;
}
