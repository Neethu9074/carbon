/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createListForm, createMapForm, ListForm, MapForm } from 'formalistic';

import {
  BurnRateAlertWindowType,
  ServiceLevelsAlertConfig,
  ServiceLevelsAlertConfigWithMetadata,
  ServiceLevelsBurnRateConfig,
  SloEntityType
} from '@instana/types';

import {
  BurnRateAlertFormFields,
  BurnRateAlertType,
  BurnRateThresholdFields,
  isServiceLevelAlertConfigWithMetaData,
  SloAlertForm,
  SloAlertFormFields,
  SloAlertRuleFormFields,
  SloAlertTimeThresholdFields
} from 'in-alerting/smart-alerts/slo/types';
import {
  noEmptySloIds,
  noInvalidOperator,
  notLessThanOrEqualToZero,
  noInvalidDurationUnit,
  burnRateConfigFormValidator
} from 'in-alerting/smart-alerts/slo/form/validators';
import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { defaultOperator, defaultSloAlertConfig } from 'in-alerting/smart-alerts/slo/data/sloAlertConfig';
import { maxValidator, positiveNumberValidator } from 'in-services/validators/number';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notBlankValidator } from 'in-services/validators/string';

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

export function generateWindowBasedBurnRateForm(
  windowName: BurnRateAlertWindowType,
  burnRate: ServiceLevelsBurnRateConfig | undefined
) {
  return createMapForm<BurnRateAlertFormFields>({
    items: {
      duration: createField({ value: burnRate?.duration ?? 0, validator: notLessThanOrEqualToZero }),
      durationUnitType: createField({
        value: burnRate?.durationUnitType ?? 'minute',
        validator: noInvalidDurationUnit
      }),
      alertWindowType: createField({ value: windowName }),
      threshold: createMapForm<BurnRateThresholdFields>({
        items: {
          operator: createField({ value: burnRate?.threshold?.operator ?? defaultOperator }),
          value: createField({
            value: burnRate?.threshold?.value ?? 0,
            validator: composeAndShortCircuitOnError(maxValidator(100), positiveNumberValidator)
          }),
          lastUpdated: createField({ value: burnRate?.threshold?.lastUpdated ?? Date.now() })
        }
      })
    }
  });
}

export function createBurnRateAlertConfig(
  configs: ServiceLevelsBurnRateConfig[],
  burnRateAlertWindow: BurnRateAlertType,
  isBurnRateBlueprint = false
): ListForm<MapForm<BurnRateAlertFormFields>[]> {
  if (!isBurnRateBlueprint)
    return createListForm({
      items: []
    });

  const singleWindowConfig = configs.find(({ alertWindowType }) => alertWindowType === 'SINGLE');
  const shortWindowConfig = configs.find(({ alertWindowType }) => alertWindowType === 'SHORT');
  const longWindowConfig = configs.find(({ alertWindowType }) => alertWindowType === 'LONG');

  if (burnRateAlertWindow === 'single') {
    return createListForm({
      items: [generateWindowBasedBurnRateForm('SINGLE', singleWindowConfig)]
    });
  } else {
    return createListForm({
      items: [
        generateWindowBasedBurnRateForm('LONG', longWindowConfig),
        generateWindowBasedBurnRateForm('SHORT', shortWindowConfig)
      ],
      validator: burnRateConfigFormValidator
    });
  }
}
export function createSloAlertForm(
  alertConfig: ServiceLevelsAlertConfig | ServiceLevelsAlertConfigWithMetadata,
  entityType?: SloEntityType
): SloAlertForm {
  const id = isServiceLevelAlertConfigWithMetaData(alertConfig) ? alertConfig.id : '';
  const isBurnRateBlueprint = alertConfig.rule.metric === 'BURN_RATE' || alertConfig.rule.metric === 'BURN_RATE_V2';
  const burnRateAlertWindowType = alertConfig.burnRateConfig?.some(
    ({ alertWindowType }) => alertWindowType === 'LONG' || alertWindowType === 'SHORT'
  )
    ? 'multi'
    : 'single';

  const form = createMapForm<SloAlertFormFields>({
    items: {
      entityType: createField({
        value: entityType,
        validator: notBlankValidator
      }),
      sloIds: createField({
        value: alertConfig.sloIds,
        validator: noEmptySloIds
      }),
      rule: createSloAlertRuleForm(alertConfig),
      threshold: createField({
        value: alertConfig?.threshold?.value ?? 0,
        validator: composeAndShortCircuitOnError(maxValidator(100))
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
      id: createField({ value: id }),
      burnRateAlertType: createField({
        value: burnRateAlertWindowType
      }),
      burnRateConfig: createBurnRateAlertConfig(
        alertConfig?.burnRateConfig ?? [],
        burnRateAlertWindowType,
        isBurnRateBlueprint
      )
    }
  });
  return form;
}
