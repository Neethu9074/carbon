/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  createField,
  createListForm,
  createMapForm,
  Field,
  Item,
  ListForm,
  MapForm,
  ValidationResult
} from 'formalistic';

import { CustomPayloadFieldUnion, StaticStringField } from '@instana/types';
import { generateUniqueShortId } from '@instana/utils';

import { isBlank, isNotBlank } from 'in-services/util/string';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

export type FieldType = string | 'staticString' | 'dynamic'; // currently, there is no Enum type on backend side

export const staticType: FieldType = 'staticString';
export const dynamicType: FieldType = 'dynamic';
export const defaultType: FieldType = staticType;

function createValidationError(errorMessage: string): ValidationResult {
  return [
    {
      severity: 'error',
      message: errorMessage
    }
  ];
}

const keyNamesMustBeUnique: ValidationResult = createValidationError(
  t('in-alerting:components.customPayload.keyNamesMustBeUnique')
);
const notBlankError: ValidationResult = createValidationError(
  t('in-alerting:components.customPayload.theValueMustNotBeBlank')
);
const invalidCharsValidator: ValidationResult = createValidationError(
  t('in-alerting:components.customPayload.onlyOrAnyAlphaNumericalAreAllowed')
);
const tagNeedsToBeSelectedError: ValidationResult = createValidationError(
  t('in-alerting:components.customPayload.aTagNeedsToBeSelected')
);
const secondKeyMayNotBeMissingError: ValidationResult = createValidationError(
  t('in-alerting:components.customPayload.aKeyNeedsToBeSpecified')
);

function nonBlankValidator(s: string | Nullish): ValidationResult {
  if (isBlank(s)) {
    return notBlankError;
  }
  return null;
}

export function needsTagAndSecondKeyMayNotBeMissingValidator(tagObject?: {
  tagName: string | Nullish;
  key?: string | Nullish;
}): ValidationResult {
  if (!tagObject || !tagObject.tagName) {
    return tagNeedsToBeSelectedError;
  }
  if (tagObject.key != null && isBlank(tagObject.key)) {
    return secondKeyMayNotBeMissingError;
  }
  return null;
}

function keyNameValidator(s: string | null): ValidationResult {
  if (isBlank(s)) {
    return notBlankError;
  }
  if (!/^[\w-.]+$/im.test(s!)) {
    return invalidCharsValidator;
  }
  return null;
}

function createFormFieldForField(field: CustomPayloadFieldUnion & { id?: string }): MapForm<any> {
  const fieldType = field.type ?? staticType;

  return createMapForm()
    .put(
      'key',
      createField({
        validator: keyNameValidator,
        value: field.key ?? ''
      })
    )
    .put(
      'id',
      createField({
        value: field.id
      })
    )
    .put(
      'type',
      createField({
        value: fieldType
      })
    )
    .put(
      'value',
      createField({
        value: (fieldType === staticType ? field.value?.toString() : field.value) ?? defaultValueForType(fieldType),
        validator: validatorForType[fieldType] ?? undefined
      })
    );
}

function onlyUniqueKeyNames(payloadItems: Item[]): ValidationResult {
  if (!payloadItems) return;

  const keys = payloadItems.map(item => ((item as MapForm<any>).get('key') as Field<string>).value).filter(isNotBlank);
  const keySet = new Set(keys);

  if (keys.length > keySet.size) {
    return keyNamesMustBeUnique;
  }
  return null;
}

export function defaultValueForType(type?: FieldType): {} | '' {
  return type === dynamicType ? {} : '';
}

export function createNewFormEntry(): MapForm<any> {
  return createFormFieldForField(enrichedWithUniqId({}));
}

/** ListForm<MapForm>, if ListForm would be typed */
export function createForm(payloadFields: CustomPayloadFieldUnion[], addEmptyEntry = true): ListForm<any> {
  const initializeListForm: ListForm<any> = createListForm({
    validator: onlyUniqueKeyNames
  });

  if (!payloadFields.length && addEmptyEntry) {
    // minimal empty entry, when nothing was specified yet
    return initializeListForm.push(createNewFormEntry());
  }

  return payloadFields.reduce<ListForm<any>>(
    (result, payloadField) => result.push(createFormFieldForField(payloadField)),
    initializeListForm
  );
}

export const enrichedWithUniqId = (item: any = {}): StaticStringField => {
  return {
    ...item,
    id: item?.key + generateUniqueShortId()
  };
};

export const validatorForType: Record<any, (value: any) => ValidationResult> = {
  [staticType]: nonBlankValidator,
  [dynamicType]: needsTagAndSecondKeyMayNotBeMissingValidator
};
