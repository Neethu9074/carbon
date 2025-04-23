/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, ListForm, MapForm, MapPath } from 'formalistic';

import {
  AlertingDurationUnitType,
  CustomPayloadFieldUnion,
  ErrorBudgetAlertMetric,
  ServiceLevelsAlertConfig,
  ServiceLevelsAlertConfigWithMetadata,
  ServiceLevelsAlertRuleUnion,
  ServiceLevelsObjectiveAlertMetric,
  SloEntityType,
  ThresholdOperator
} from '@instana/types';

import {
  noEmptySloIds,
  noInvalidOperator,
  notLessThanOrEqualToZero,
  noInvalidDurationUnit
} from 'in-alerting/smart-alerts/slo/form/validators';
import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { defaultOperator, defaultSloAlertConfig } from 'in-alerting/smart-alerts/slo/data/sloAlertConfig';
import { isServiceLevelAlertConfigWithMetaData } from 'in-alerting/smart-alerts/slo/types';
import { maxValidator, positiveNumberValidator } from 'in-services/validators/number';
import { burnRateFormValidator } from 'in-alerting/smart-alerts/slo/form/validators';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notBlankValidator } from 'in-services/validators/string';

export type SloAlertRuleFormFields = {
  alertType: Field<ServiceLevelsAlertRuleUnion['alertType']>;
  metric: Field<ErrorBudgetAlertMetric | ServiceLevelsObjectiveAlertMetric>;
};
export type SloAlertFormTimeWindowFields = {
  duration: Field<number>;
  durationType: Field<AlertingDurationUnitType>;
};
export type SloAlertBurnRateTimeWindowsFields = {
  longTimeWindow: MapForm<SloAlertFormTimeWindowFields>;
  shortTimeWindow: MapForm<SloAlertFormTimeWindowFields>;
};
export type SloAlertTimeThresholdFields = {
  expiry: Field<number>;
  timeWindow: Field<number>;
};
export type SloAlertFormFields = {
  entityType: Field<SloEntityType | undefined>;
  burnRateTimeWindows: MapForm<SloAlertBurnRateTimeWindowsFields>;
  sloIds: Field<string[]>;
  rule: MapForm<SloAlertRuleFormFields>;
  threshold: Field<number | undefined>;
  operator: Field<ThresholdOperator>;
  timeThreshold: MapForm<SloAlertTimeThresholdFields>;
  alertChannelIds: Field<string[]>;
  severity: Field<number>;
  name: Field<string>;
  description: Field<string>;
  triggering: Field<boolean>;
  customPayloadFields: ListForm<Field<CustomPayloadFieldUnion>[]>;
  id: Field<string>;
};
export type SloAlertFormPath = MapPath<SloAlertFormFields>;
export interface SloAlertForm extends MapForm<SloAlertFormFields> {}

export function createSloAlertRuleForm(alertConfig: ServiceLevelsAlertConfig): MapForm<SloAlertRuleFormFields> {
  return createMapForm({
    items: {
      alertType: createField({
        value: alertConfig.rule.alertType
      }),
      metric: createField({
        value: alertConfig.rule.metric ?? 'STATUS'
      })
    }
  });
}

export function createUnvalidatedLongTimeWindowForm(
  alertConfig?: ServiceLevelsAlertConfig
): MapForm<SloAlertFormTimeWindowFields> {
  return createMapForm({
    items: {
      duration: createField({
        value: alertConfig?.burnRateTimeWindows?.longTimeWindow?.duration ?? 0
      }),
      durationType: createField({
        value: alertConfig?.burnRateTimeWindows?.longTimeWindow?.durationType ?? 'minute'
      })
    }
  });
}

export function createValidatedLongTimeWindowForm(
  alertConfig?: ServiceLevelsAlertConfig
): MapForm<SloAlertFormTimeWindowFields> {
  return createMapForm({
    items: {
      duration: createField({
        value: alertConfig?.burnRateTimeWindows?.longTimeWindow?.duration ?? 0,
        validator: notLessThanOrEqualToZero
      }),
      durationType: createField({
        value: alertConfig?.burnRateTimeWindows?.longTimeWindow?.durationType ?? 'minute',
        validator: noInvalidDurationUnit
      })
    }
  });
}

export function createUnvalidatedShortTimeWindowForm(
  alertConfig?: ServiceLevelsAlertConfig
): MapForm<SloAlertFormTimeWindowFields> {
  return createMapForm({
    items: {
      duration: createField({
        value: alertConfig?.burnRateTimeWindows?.shortTimeWindow?.duration ?? 0
      }),
      durationType: createField({
        value: alertConfig?.burnRateTimeWindows?.shortTimeWindow?.durationType ?? 'minute'
      })
    }
  });
}

export function createValidatedShortTimeWindowForm(
  alertConfig?: ServiceLevelsAlertConfig
): MapForm<SloAlertFormTimeWindowFields> {
  return createMapForm({
    items: {
      duration: createField({
        value: alertConfig?.burnRateTimeWindows?.shortTimeWindow?.duration ?? 0,
        validator: notLessThanOrEqualToZero
      }),
      durationType: createField({
        value: alertConfig?.burnRateTimeWindows?.shortTimeWindow?.durationType ?? 'minute',
        validator: noInvalidDurationUnit
      })
    }
  });
}

export function createUnvalidatedSloBurnRateTimeWindowsForm(
  alertConfig?: ServiceLevelsAlertConfig
): MapForm<SloAlertBurnRateTimeWindowsFields> {
  return createMapForm({
    items: {
      shortTimeWindow: createUnvalidatedShortTimeWindowForm(alertConfig),
      longTimeWindow: createUnvalidatedLongTimeWindowForm(alertConfig)
    }
  });
}

export function createValidatedSloBurnRateTimeWindowsForm(
  alertConfig?: ServiceLevelsAlertConfig
): MapForm<SloAlertBurnRateTimeWindowsFields> {
  return createMapForm({
    items: {
      shortTimeWindow: createValidatedShortTimeWindowForm(alertConfig),
      longTimeWindow: createValidatedLongTimeWindowForm(alertConfig)
    },
    validator: burnRateFormValidator
  });
}

export function createSloAlertTimeThresholdForm(
  alertConfig: ServiceLevelsAlertConfig
): MapForm<SloAlertTimeThresholdFields> {
  return createMapForm({
    items: {
      expiry: createField({
        value: alertConfig.timeThreshold.expiry ?? defaultSloAlertConfig.timeThreshold.expiry!,
        validator: notLessThanOrEqualToZero
      }),
      timeWindow: createField({
        value: alertConfig.timeThreshold.timeWindow,
        validator: notLessThanOrEqualToZero
      })
    }
  });
}

export function createSloAlertForm(
  alertConfig: ServiceLevelsAlertConfig | ServiceLevelsAlertConfigWithMetadata,
  entityType?: SloEntityType
): SloAlertForm {
  const id = isServiceLevelAlertConfigWithMetaData(alertConfig) ? alertConfig.id : '';
  const isBurnRateBlueprint = alertConfig.rule.metric === 'BURN_RATE';
  const form = createMapForm<SloAlertFormFields>({
    items: {
      entityType: createField({
        value: entityType,
        validator: notBlankValidator
      }),
      burnRateTimeWindows: isBurnRateBlueprint
        ? createValidatedSloBurnRateTimeWindowsForm(alertConfig)
        : createUnvalidatedSloBurnRateTimeWindowsForm(alertConfig),
      sloIds: createField({
        value: alertConfig.sloIds,
        validator: noEmptySloIds
      }),
      rule: createSloAlertRuleForm(alertConfig),
      threshold: createField({
        value: alertConfig?.threshold?.value,
        validator: composeAndShortCircuitOnError(maxValidator(100), positiveNumberValidator)
      }),
      operator: createField({
        value: alertConfig?.threshold?.operator ?? defaultOperator,
        validator: noInvalidOperator
      }),
      timeThreshold: createSloAlertTimeThresholdForm(alertConfig),
      alertChannelIds: createField({
        value: alertConfig.alertChannelIds
      }),
      severity: createField({
        value: alertConfig.severity
      }),
      name: createField({
        value: alertConfig.name,
        validator: notBlankValidator
      }),
      description: createField({
        value: alertConfig.description,
        validator: notBlankValidator
      }),
      triggering: createField({
        value: alertConfig.triggering
      }),
      customPayloadFields: createListFormForCustomPayloads(alertConfig.customPayloadFields, false),
      id: createField({ value: id })
    }
  });
  return form;
}
