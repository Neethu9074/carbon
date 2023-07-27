/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  ApplicationSloEntity,
  ServiceLevelIndicatorUnion,
  ServiceLevelObjectiveConfiguration,
  WebsiteSloEntity
} from '@instana/types';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';

import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { ServiceLevelErrors } from 'in-service-levels/constants';

export function formToSloConfiguration(form: SloForm): ServiceLevelObjectiveConfiguration {
  return {
    name: form.getIn(['nameTags', 'name']).value,
    tags: form.getIn(['nameTags', 'tags']).value,
    entity: formToEntity(form),
    indicator: formToIndicator(form),
    timeWindow: {
      duration: form.getIn(['timeWindow', 'duration']).value,
      durationUnit: form.getIn(['timeWindow', 'durationUnit']).value,
      startTimestamp: form.getIn(['timeWindow', 'startTimestamp']).value,
      type: form.getIn(['timeWindow', 'type']).value
    },
    target: 0
  };
}

function formToEntity(form: SloForm): ApplicationSloEntity | WebsiteSloEntity {
  const entityType = form.getIn(['entity', 'type']).value;

  if (entityType === 'application') {
    return {
      applicationId: form.getIn(['entity', 'entityId']).value,
      boundaryScope: form.getIn(['scope', 'boundaryScope']).value,
      serviceId: form.getIn(['scope', 'serviceId']).value || undefined,
      endpointId: form.getIn(['scope', 'boundaryScope']).value || undefined,
      includeInternal: form.getIn(['scope', 'includeInternal']).value,
      includeSynthetic: form.getIn(['scope', 'includeSynthetic']).value,
      tagFilterExpression: toBackendQueryModel(form.getIn(['scope', 'tagFilterExpression']).value),
      type: 'application'
    };
  }

  if (entityType === 'website') {
    return {
      websiteId: form.getIn(['entity', 'entityId']).value,
      beaconType: form.getIn(['scope', 'beaconType']).value,
      tagFilterExpression: toBackendQueryModel(form.getIn(['scope', 'tagFilterExpression']).value),
      type: 'website'
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

function formToIndicator(form: SloForm): ServiceLevelIndicatorUnion {
  const indicatorType = form.getIn(['indicator', 'type']).value;

  if (indicatorType === 'customEventBased') {
    return {
      goodEventsFilter: toBackendQueryModel(form.getIn(['indicator', 'goodEventsFilter']).value),
      badEventsFilter: toBackendQueryModel(form.getIn(['indicator', 'badEventsFilter']).value),
      blueprint: form.getIn(['indicator', 'blueprint']).value,
      threshold: form.getIn(['indicator', 'threshold']).value,
      type: 'customEventBased'
    };
  }

  if (indicatorType === 'eventBased') {
    return {
      blueprint: form.getIn(['indicator', 'blueprint']).value,
      threshold: form.getIn(['indicator', 'threshold']).value,
      type: 'eventBased'
    };
  }

  if (indicatorType === 'timeBased') {
    return {
      aggregation: form.getIn(['indicator', 'aggregation']).value,
      blueprint: form.getIn(['indicator', 'blueprint']).value,
      threshold: form.getIn(['indicator', 'threshold']).value,
      type: 'timeBased'
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLI_TYPE);
}
