/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field } from 'formalistic';

import { isTimeBasedSli, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { DurationUnitType, isEventBasedSli } from '@instana/types';

import {
  SloEntityFields,
  SloForm,
  SloIndicatorFields,
  SloObjectiveFields,
  SloScopeFields,
  TimeStamp
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import {
  createThresholdFieldValidator,
  dateFieldValidator,
  targetFieldValidator,
  timeFieldValidator
} from 'in-service-levels/components/ConfigDialog/createSloForm/validator';
import {
  createIndicatorThresholdField,
  createSloNameTagsFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { defaultBlueprint } from 'in-service-levels/constants';
import { SloBeaconTypes } from 'in-service-levels/types';
import { formatDate } from 'in-services/formatters/date';

export const getEntityFieldsFromSloConfig = (sloConfig: ServiceLevelObjectiveConfiguration): SloEntityFields => {
  return {
    entityId: createField({
      value: sloConfig.entity.type === 'application' ? sloConfig.entity.applicationId : sloConfig.entity.websiteId
    }),
    type: createField({ value: sloConfig.entity.type })
  };
};

export const getScopeFieldsFromSloConfig = (sloConfig: ServiceLevelObjectiveConfiguration): SloScopeFields => {
  if (sloConfig.entity.type === 'application') {
    const { boundaryScope, endpointId, includeInternal, includeSynthetic, serviceId, tagFilterExpression } =
      sloConfig.entity;

    return {
      beaconType: createField({ value: 'httpRequest' }),
      boundaryScope: createField({ value: boundaryScope }),
      endpointId: createField({ value: endpointId ?? '' }),
      includeInternal: createField({ value: includeInternal ?? false }),
      includeSynthetic: createField({ value: includeSynthetic ?? false }),
      serviceId: createField({ value: serviceId ?? '' }),
      tagFilterExpression: createField({ value: fromBackendModel(tagFilterExpression) })
    };
  }

  return {
    beaconType: createField({ value: sloConfig.entity.beaconType }) as Field<SloBeaconTypes>,
    boundaryScope: createField({ value: 'ALL' }),
    endpointId: createField({ value: '' }),
    includeInternal: createField({ value: false }),
    includeSynthetic: createField({ value: false }),
    serviceId: createField({ value: '' }),
    tagFilterExpression: createField({ value: fromBackendModel(sloConfig.entity.tagFilterExpression) })
  };
};

export const getIndicatorFormFieldsFromSloConfig = (
  sloConfig: ServiceLevelObjectiveConfiguration
): SloIndicatorFields => {
  const { indicator } = sloConfig;
  const { type } = indicator;

  if (isTimeBasedSli(indicator)) {
    const blueprint = indicator.blueprint ?? defaultBlueprint;
    return {
      aggregation: createField({ value: indicator.aggregation ?? 'MEAN' }),
      blueprint: createField({ value: blueprint }),
      threshold: createIndicatorThresholdField({ value: indicator.threshold, blueprint, indicatorType: type }),
      badEventsFilter: createField({
        value: []
      }),
      goodEventsFilter: createField({
        value: []
      }),
      type: createField({ value: type })
    };
  }

  if (isEventBasedSli(indicator)) {
    const blueprint = indicator.blueprint ?? defaultBlueprint;
    return {
      aggregation: createField({ value: 'MEAN' }),
      badEventsFilter: createField({
        value: []
      }),
      blueprint: createField({ value: blueprint }),
      goodEventsFilter: createField({
        value: []
      }),
      threshold: createField({
        value: indicator.threshold ?? undefined,
        validator: createThresholdFieldValidator(blueprint, type)
      }),
      type: createField({ value: type })
    };
  }

  const blueprint = defaultBlueprint;
  return {
    aggregation: createField({ value: 'MEAN' }),
    badEventsFilter: createField({
      value: fromBackendModel(indicator.badEventsFilter)
    }),
    blueprint: createField({ value: blueprint }),
    goodEventsFilter: createField({
      value: fromBackendModel(indicator.goodEventsFilter)
    }),
    threshold: createField({
      value: indicator.threshold ?? 0,
      validator: createThresholdFieldValidator(blueprint, type)
    }),
    type: createField({ value: type })
  };
};
export const getObjectiveFormFieldsFromSloConfig = (
  sloConfig: ServiceLevelObjectiveConfiguration
): SloObjectiveFields => {
  return {
    target: createField<number | undefined>({
      value: undefined,
      validator: targetFieldValidator
    }),
    duration: createField({ value: sloConfig.timeWindow.duration }),
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
        value: formatDate(timeStamp)!,
        validator: timeFieldValidator
      })
    };
  }
  return {
    date: createField<string>({ value: formatDate(timeStamp)!, validator: dateFieldValidator }),
    time: createField<string>({
      value: formatDate(timeStamp)!,
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
        items: getIndicatorFormFieldsFromSloConfig(sloConfig)
      }),
      scope: createMapForm({
        items: getScopeFieldsFromSloConfig(sloConfig)
      }),
      objective: createMapForm({
        items: getObjectiveFormFieldsFromSloConfig(sloConfig)
      }),
      nameTags: createMapForm({
        items: createSloNameTagsFields(sloConfig)
      })
    }
  });
};
