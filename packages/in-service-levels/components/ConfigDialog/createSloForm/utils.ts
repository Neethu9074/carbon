/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field } from 'formalistic';

import {
  ApplicationSloEntity,
  BlueprintType,
  ServiceLevelIndicatorUnion,
  ServiceLevelObjectiveConfiguration,
  TimeWindow,
  WebsiteSloEntity
} from '@instana/types';

import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { parseDateTime } from 'in-services/formatters/date';

export function isFieldValid<VALUE_TYPE>(field: Field<VALUE_TYPE>) {
  return field.valid || !field.touched;
}

export function formToSloConfiguration(form: SloForm, id?: string): ServiceLevelObjectiveConfiguration {
  const date = form.getIn(['objective', 'startTimestamp', 'date']).value;
  const time = form.getIn(['objective', 'startTimestamp', 'time']).value;
  const startTimestamp = parseDateTime(`${date} ${time}`).getTime();

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
      startTimestamp
    },
    target: form.getIn(['objective', 'target']).value ?? 0
  };
}

export function formToEntity(form: SloForm): ApplicationSloEntity | WebsiteSloEntity {
  const entityType = form.getIn(['entity', 'type']).value;

  const tagFilterExpressionField = form.getIn(['scope', 'tagFilterExpression']);
  const tagFilterExpression = tagFilterExpressionField.valid
    ? toBackendQueryModel(tagFilterExpressionField.value)
    : emptyTagFilterExpression;

  if (entityType === 'application') {
    return {
      applicationId: form.getIn(['entity', 'entityId']).value,
      boundaryScope: form.getIn(['scope', 'boundaryScope']).value,
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
      websiteId: form.getIn(['entity', 'entityId']).value,
      beaconType: form.getIn(['scope', 'beaconType']).value,
      tagFilterExpression,
      type: 'website'
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

export function formToIndicator(form: SloForm): ServiceLevelIndicatorUnion {
  const indicatorType = form.getIn(['indicator', 'type']).value;

  if (indicatorType === 'customEventBased') {
    return {
      goodEventsFilter: toBackendQueryModel(form.getIn(['indicator', 'goodEventsFilter']).value),
      badEventsFilter: toBackendQueryModel(form.getIn(['indicator', 'badEventsFilter']).value),
      threshold: form.getIn(['indicator', 'threshold']).value ?? 0,
      type: 'customEventBased'
    };
  }

  if (indicatorType === 'eventBased') {
    return {
      blueprint: form.getIn(['indicator', 'blueprint']).value as BlueprintType,
      threshold: form.getIn(['indicator', 'threshold']).value ?? 0,
      type: 'eventBased'
    };
  }

  if (indicatorType === 'timeBased') {
    return {
      aggregation: form.getIn(['indicator', 'aggregation']).value,
      blueprint: form.getIn(['indicator', 'blueprint']).value as BlueprintType,
      threshold: form.getIn(['indicator', 'threshold']).value ?? 0,
      type: 'timeBased'
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLI_TYPE);
}

export function formToTimeWindow(form: SloForm): TimeWindow {
  const duration = form.getIn(['objective', 'duration']).value;
  const durationUnit = form.getIn(['objective', 'durationUnit']).value;
  const type = form.getIn(['objective', 'type']).value;

  return {
    duration,
    durationUnit,
    type
  };
}
