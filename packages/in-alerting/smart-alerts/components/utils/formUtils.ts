/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, ListForm, MapForm } from 'formalistic';

import { AggregationType, ThresholdOperator } from '@instana/types';

import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { Option } from 'in-components/ComboBox/ComboBox';
import { t } from 'in-i18n';

export function getAggregationText(aggregation: AggregationType): string {
  switch (aggregation.toUpperCase()) {
    case 'P25':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP25');
    case 'P50':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP50');
    case 'P75':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP75');
    case 'P90':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP90');
    case 'P95':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP95');
    case 'P98':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP98');
    case 'P99':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP99');
    default:
      return aggregation.toLowerCase();
  }
}

type ValueLabelPair = {
  value: string;
};

export function findEntryByValue(valueLabelPairList: Option[], value?: string): ValueLabelPair | undefined {
  const items = valueLabelPairList ?? [];
  return items.find(item => item?.value === value);
}

export function alertConfigWithDefaultThreshold(form: MapForm<any>) {
  const threshold: MapForm<any> = form.get('threshold') as MapForm<any>;
  const thresholdValue: Field<any> | undefined = threshold.get('value') as Field<any> | undefined;
  return {
    ...form.toJS(),
    threshold: {
      ...threshold?.toJS(),
      value: thresholdValue?.value ?? null
    }
  };
}

export function alertConfigWithDefaultThresholdAndTfe(form: MapForm<any>) {
  const threshold: MapForm<any> = form.get('threshold') as MapForm<any>;
  const thresholdValue: Field<any> | undefined = threshold.get('value') as Field<any> | undefined;
  const tagFilterExpression = form.get('tagFilterExpression').value;
  return {
    ...form.toJS(),
    threshold: {
      ...threshold?.toJS(),
      value: thresholdValue?.value ?? null
    },
    tagFilterExpression: toBackendQueryModel(tagFilterExpression)
  };
}

/**
 * @returns true, if field exists, is touched and is not valid
 */
export function fieldTouchedAndInvalid(field: Field<any>): boolean {
  return field && field.touched && !field.valid;
}

function payloadItemInvalid(item: MapForm<any>): boolean {
  const key = item.get('key') as Field<any>;
  const val = item.get('value') as Field<any>;
  return fieldTouchedAndInvalid(key) || fieldTouchedAndInvalid(val);
}

/**
 * Checks the field `customPayloadFields` of the given form, if
 * - it is not touched and
 * - it is valid and
 * - each payload-item's form has only untouched or valid fields
 *
 * @returns result or true when the customPayloads-field does not exist
 */
export function isCustomPayloadValidOrUntouched(form: MapForm<any>): boolean {
  const customPayloadForm = (form.get('customPayloadFields') as ListForm<any>) ?? {};
  const { touched, valid } = customPayloadForm;
  // @ts-expect-error TS2339: Property 'items' does not exist on type 'ListForm'.
  const items: MapForm<any>[] = customPayloadForm.items;

  if (!touched) {
    return true;
  }

  if (!valid) {
    // typically, when the keys are not unique
    return false;
  }

  // check all custom payload entries:
  return !items.find(payloadItemInvalid);
}

export function getHigherOrLowerOperatorContext(operator: ThresholdOperator) {
  switch (operator) {
    case '>':
      // "higher than"
      return 'higherThan';
    case '>=':
      // "higher or equal to"
      return 'higherEqual';
    case '<':
      // "lower than"
      return 'lowerThan';
    case '<=':
      // "lower or equal to"
      return 'lowerEqual';
    default:
      throw Error('Unsupported operator: ' + operator);
  }
}
