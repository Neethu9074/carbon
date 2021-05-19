/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, createListForm } from 'formalistic';

import { isBlank, isNotBlank } from 'in-services/util/string';
import { generateUniqueShortId } from 'in-services/util/id';
import { t } from 'in-i18n';

export const staticType = 'staticString';
export const dynamicType = 'dynamic';
export const defaultType = staticType;

const staticBooleanType = 'staticBoolean';
const staticNumberType = 'staticNumber';

function createValidationError(errorMessage) {
  return [
    {
      severity: 'error',
      message: errorMessage
    }
  ];
}

const keyNamesMustBeUnique = createValidationError(t('in-alerting:components.customPayload.keyNamesMustBeUnique'));
const notBlankError = createValidationError(t('in-alerting:components.customPayload.theValueMustNotBeBlank'));
const invalidCharsValidator = createValidationError(
  t('in-alerting:components.customPayload.onlyOrAnyAlphaNumericalAreAllowed')
);
const tagNeedsToBeSelectedError = createValidationError(
  t('in-alerting:components.customPayload.aTagNeedsToBeSelected')
);
const secondKeyMayNotBeMissingError = createValidationError(
  t('in-alerting:components.customPayload.aKeyNeedsToBeSpecified')
);

function nonBlankValidator(s) {
  if (isBlank(s)) {
    return notBlankError;
  }
}

function needsTagAndSecondKeyMayNotBeMissingValidator(tagObject) {
  if (!tagObject || !tagObject.tagName) {
    return tagNeedsToBeSelectedError;
  }
  if (tagObject.key != null && isBlank(tagObject.key)) {
    return secondKeyMayNotBeMissingError;
  }
}

function keyNameValidator(s) {
  if (isBlank(s)) {
    return notBlankError;
  }
  if (!/^[\w-.]+$/im.test(s)) {
    return invalidCharsValidator;
  }
}

function getFieldType(field) {
  return [staticBooleanType, staticNumberType].includes(field.type) ? staticType : field.type;
}

function createFormFieldForField(field) {
  const fieldType = getFieldType(field);

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
        value: fieldType ?? defaultType
      })
    )
    .put(
      'value',
      createField({
        value:
          (fieldType === staticType ? field.value?.toString() : field.value) ??
          defaultValueForType(fieldType ?? defaultType),
        validator: validatorForType[fieldType ?? defaultType] ?? undefined
      })
    );
}

function onlyUniqueKeyNames(payloadItems) {
  if (!payloadItems) return;

  const keys = payloadItems.map(item => item.get('key').value).filter(isNotBlank);
  const keySet = new Set(keys);

  if (keys.length > keySet.size) {
    return keyNamesMustBeUnique;
  }
}

export function defaultValueForType(type) {
  return type === dynamicType ? {} : '';
}

export function createNewFormEntry() {
  return createFormFieldForField(enrichedWithUniqId({}));
}

export function createForm(payloadFields, addEmptyEntry = true) {
  const initializeListForm = createListForm({
    validator: onlyUniqueKeyNames
  });

  if (!payloadFields.length && addEmptyEntry) {
    // minimal empty entry, when nothing was specified yet
    return initializeListForm.push(createNewFormEntry());
  }

  return payloadFields.reduce(
    (result, payloadField) => result.push(createFormFieldForField(payloadField)),
    initializeListForm
  );
}

export function validateCheckForCustomPayload(form) {
  const listForm = form.get('customPayloadFields');

  return listForm.hierarchyValid && listForm.items.length > 0;
}

export const enrichedWithUniqId = (item = {}) => {
  return {
    ...item,
    id: item.key + generateUniqueShortId()
  };
};

export const validatorForType = {
  [staticType]: nonBlankValidator,
  [dynamicType]: needsTagAndSecondKeyMayNotBeMissingValidator
};
