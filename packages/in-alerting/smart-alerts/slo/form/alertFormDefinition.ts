/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, ListForm, MapForm, MapPath } from 'formalistic';

import {
  CustomPayloadFieldUnion,
  ErrorBudgetAlertMetric,
  ServiceLevelsAlertConfig,
  ServiceLevelsAlertConfigWithMetadata,
  ServiceLevelsAlertRuleUnion,
  ServiceLevelsObjectiveAlertMetric,
  ThresholdOperator
} from '@instana/types';

import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { noEmptySloIds, notLessThanOrEqualToZero } from 'in-alerting/smart-alerts/slo/form/validators';
import { isServiceLevelAlertConfigWithMetaData } from 'in-alerting/smart-alerts/slo/types';
import { positiveNumberValidator } from 'in-services/validators/number';
import { notBlankValidator } from 'in-services/validators/string';

export type SloAlertRuleFormFields = {
  alertType: Field<ServiceLevelsAlertRuleUnion['alertType']>;
  metric: Field<ErrorBudgetAlertMetric | ServiceLevelsObjectiveAlertMetric>;
};
export type SloAlertTimeThresholdFields = {
  timeWindow: Field<number>;
};
export type SloAlertFormFields = {
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

export function createSloAlertTimeThresholdForm(
  alertConfig: ServiceLevelsAlertConfig
): MapForm<SloAlertTimeThresholdFields> {
  return createMapForm({
    items: {
      timeWindow: createField({
        value: alertConfig.timeThreshold.timeWindow,
        validator: notLessThanOrEqualToZero
      })
    }
  });
}

export function createSloAlertForm(
  alertConfig: ServiceLevelsAlertConfig | ServiceLevelsAlertConfigWithMetadata
): SloAlertForm {
  const id = isServiceLevelAlertConfigWithMetaData(alertConfig) ? alertConfig.id : '';
  const form = createMapForm<SloAlertFormFields>({
    items: {
      sloIds: createField({
        value: alertConfig.sloIds,
        validator: noEmptySloIds
      }),
      rule: createSloAlertRuleForm(alertConfig),
      threshold: createField({
        value: alertConfig.threshold.value,
        validator: positiveNumberValidator
      }),
      operator: createField({ value: alertConfig.threshold.operator }),
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
