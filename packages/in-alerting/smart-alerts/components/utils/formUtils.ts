/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, ListForm, MapForm } from 'formalistic';

import { AggregationType } from 'in-types';
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

export function findEntryByValue(valueLabelPairList: ValueLabelPair[], value?: string): ValueLabelPair | undefined {
  const items = valueLabelPairList ?? [];
  return items.find(item => item?.value === value);
}

export function alertConfigWithDefaultThreshold(form: MapForm) {
  const threshold: MapForm = form.get('threshold') as MapForm;
  const thresholdValue: Field<any> | undefined = threshold.get('value') as Field<any> | undefined;
  return {
    ...form.toJS(),
    threshold: {
      ...threshold?.toJS(),
      value: thresholdValue?.value ?? null
    }
  };
}

/**
 * @returns true, if field exists, is touched and is not valid
 */
export function fieldTouchedAndInvalid(field: Field<any>): boolean {
  return field && field.touched && !field.valid;
}

function payloadItemInvalid(item: MapForm): boolean {
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
export function isCustomPayloadValidOrUntouched(form: MapForm): boolean {
  const customPayloadForm = (form.get('customPayloadFields') as ListForm) ?? {};
  const { touched, valid } = customPayloadForm;
  // @ts-expect-error TS2339: Property 'items' does not exist on type 'ListForm'.
  const items: MapForm[] = customPayloadForm.items;

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
