/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field } from 'formalistic';

import { isApplicationSloEntity, isWebsiteSloEntity, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { DurationUnitType } from '@instana/types';
import { formatTime } from '@instana/format-date';

import {
  createThresholdFieldValidator,
  dateFieldValidator,
  indicatorFormValidator,
  noBlankEntitySelection,
  noInvalidTagFilterExpression,
  targetFieldValidator,
  timeFieldValidator,
  timeWindowValidator
} from 'in-service-levels/components/ConfigDialog/createSloForm/validator';
import {
  SloEntityFields,
  SloForm,
  SloIndicatorFields,
  SloObjectiveFields,
  SloScopeFields,
  TimeStamp
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import {
  createIndicatorThresholdField,
  createSloNameTagsFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';
import { numericValidator, positiveNumberValidator } from 'in-services/validators/number';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { isCustomBlueprintIndicator, SloBeaconTypes } from 'in-service-levels/types';
import { defaultBlueprint, ServiceLevelErrors } from 'in-service-levels/constants';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { getSloEntityIds } from 'in-service-levels/utils/sloConfig';
import { formatDate } from 'in-services/formatters/date';

export const getEntityFieldsFromSloConfig = (sloConfig: ServiceLevelObjectiveConfiguration): SloEntityFields => {
  const { entity } = sloConfig;
  return {
    entityIds: createField({
      value: getSloEntityIds(entity),
      validator: noBlankEntitySelection
    }),
    type: createField({ value: entity.type })
  };
};

export const getScopeFieldsFromSloConfig = ({ entity }: ServiceLevelObjectiveConfiguration): SloScopeFields => {
  if (isApplicationSloEntity(entity)) {
    const { boundaryScope, endpointId, includeInternal, includeSynthetic, serviceId, tagFilterExpression } = entity;

    return {
      beaconType: createField({ value: 'httpRequest' }),
      boundaryScope: createField({ value: boundaryScope }),
      endpointId: createField({ value: endpointId ?? '' }),
      includeInternal: createField({ value: includeInternal ?? false }),
      includeSynthetic: createField({ value: includeSynthetic ?? false }),
      serviceId: createField({ value: serviceId ?? '' }),
      tagFilterExpression: createField({
        value: fromBackendModel(tagFilterExpression),
        validator: noInvalidTagFilterExpression
      })
    };
  }

  if (isWebsiteSloEntity(entity)) {
    return {
      beaconType: createField({ value: entity.beaconType }) as Field<SloBeaconTypes>,
      boundaryScope: createField({ value: 'ALL' }),
      endpointId: createField({ value: '' }),
      includeInternal: createField({ value: false }),
      includeSynthetic: createField({ value: false }),
      serviceId: createField({ value: '' }),
      tagFilterExpression: createField({
        value: fromBackendModel(entity.tagFilterExpression),
        validator: noInvalidTagFilterExpression
      })
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
};

export const getIndicatorFormFieldsFromSloConfig = (
  sloConfig: ServiceLevelObjectiveConfiguration
): SloIndicatorFields => {
  const { indicator } = sloConfig;
  const { type } = indicator;

  if (indicator.type === 'timeBased') {
    const blueprint = indicator.blueprint ?? defaultBlueprint;
    return {
      aggregation: createField({ value: indicator.aggregation ?? 'MEAN' }),
      blueprint: createField({ value: blueprint }),
      threshold: createIndicatorThresholdField({ value: indicator.threshold, blueprint, indicatorType: type }),
      badEventsFilter: createField({ value: [] }),
      goodEventsFilter: createField({ value: [] }),
      type: createField({ value: type })
    };
  }

  if (indicator.type === 'eventBased') {
    const blueprint = indicator.blueprint ?? defaultBlueprint;
    const isCustomBlueprint = isCustomBlueprintIndicator(indicator);

    return {
      aggregation: createField({ value: 'MEAN' }),
      blueprint: createField({ value: blueprint }),
      badEventsFilter: createField({ value: isCustomBlueprint ? fromBackendModel(indicator.badEventsFilter) : [] }),
      goodEventsFilter: createField({ value: isCustomBlueprint ? fromBackendModel(indicator.goodEventsFilter) : [] }),
      threshold: createField({
        value: indicator.threshold ?? undefined,
        validator: createThresholdFieldValidator(blueprint, type)
      }),
      type: createField({ value: type })
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLI_TYPE);
};

export const getObjectiveFormFieldsFromSloConfig = (
  sloConfig: ServiceLevelObjectiveConfiguration
): SloObjectiveFields => {
  return {
    target: createField<number | undefined>({
      value: sloConfig.target,
      validator: targetFieldValidator
    }),
    duration: createField({
      value: sloConfig.timeWindow.duration,
      validator: composeAndShortCircuitOnError(numericValidator, positiveNumberValidator)
    }),
    durationUnit: createField<DurationUnitType>({ value: sloConfig.timeWindow.durationUnit }),
    startTimestamp: createMapForm<TimeStamp>({
      items: getDefaultTimestampField(sloConfig)
    }),
    type: createField({ value: sloConfig.timeWindow.type })
  };
};

export const getDefaultTimestampField = (sloConfig: ServiceLevelObjectiveConfiguration) => {
  const timeWindowType = sloConfig.timeWindow?.type;
  const timeStamp = new Date().setHours(0, 0, 0, 0);
  if (timeWindowType === 'fixed') {
    return {
      date: createField<string>({
        value: formatDate(sloConfig.timeWindow.startTimestamp) ?? formatDate(timeStamp)!,
        validator: dateFieldValidator
      }),
      time: createField<string>({
        value: formatTime(sloConfig.timeWindow.startTimestamp) ?? formatTime(timeStamp)!,
        validator: timeFieldValidator
      })
    };
  }
  return {
    date: createField<string>({ value: formatDate(timeStamp)!, validator: dateFieldValidator }),
    time: createField<string>({
      value: formatTime(timeStamp)!,
      validator: timeFieldValidator
    })
  };
};

export const createSloFormFromSloConfig = (sloConfig: ServiceLevelObjectiveConfiguration): SloForm => {
  return createMapForm({
    items: {
      entity: createMapForm({
        items: getEntityFieldsFromSloConfig(sloConfig)
      }),
      indicator: createMapForm({
        items: getIndicatorFormFieldsFromSloConfig(sloConfig),
        validator: indicatorFormValidator
      }),
      scope: createMapForm({
        items: getScopeFieldsFromSloConfig(sloConfig)
      }),
      objective: createMapForm({
        items: getObjectiveFormFieldsFromSloConfig(sloConfig),
        validator: timeWindowValidator
      }),
      nameTags: createMapForm({
        items: createSloNameTagsFields(sloConfig)
      })
    }
  });
};
