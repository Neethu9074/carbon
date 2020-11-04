import { createMapForm, createField, createListForm } from 'formalistic';

import { isBlank, isNotBlank } from 'in-services/util/string';
import { generateUniqueShortId } from 'in-services/util/id';
import { emptyArray } from 'in-services/fixedObjects';
import { hasError } from 'in-services/util/result';

export const staticBooleanType = 'staticBoolean';
export const staticNumberType = 'staticNumber';
export const staticStringType = 'staticString';
export const dynamicType = 'dynamic';
export const defaultType = staticStringType;

export const enrichedWithUniqId = (item = {}) => {
  item.id = item.key + generateUniqueShortId();
  return item;
};

export const toServerItemModel = (item = {}) => {
  const { key, type, value } = item;
  return { key, type, value };
};

export function mergeResultWithPayloadForm(form, result) {
  if (hasError(result)) {
    return {
      ...result,
      errors: emptyArray,
      data: { items: [] }
    };
  }
  return {
    ...result,
    data: {
      ...result,
      items: form
    }
  };
}

function createValidationError(errorMessage) {
  return [
    {
      severity: 'error',
      message: errorMessage
    }
  ];
}

const notBlankError = createValidationError('The value must not be blank.');

const invalidCharsValidator = createValidationError(`Only '.', '-', '_' or any alpha-numerical are allowed.`);

function keyNameValidator(s) {
  if (isBlank(s)) {
    return notBlankError;
  }
  if (!/^[\w-.]+$/im.test(s)) {
    return invalidCharsValidator;
  }
}

function nonBlankValidator(s) {
  if (isBlank(s)) {
    return notBlankError;
  }
}

function longNumberValidator(num) {
  if (typeof num === 'string') {
    if (isBlank(num)) {
      return notBlankError;
    }
  }
  if (!Number.isSafeInteger(Number(num).valueOf())) {
    return numberMustBeLong;
  }
}

const numberMustBeLong = createValidationError('Number must be a Long integer value');

function needsTagAndSecondKeyMayNotBeMissingValidator(tagObject) {
  if (!tagObject || !tagObject.tagName) {
    return tagNeedsToBeSelectedError;
  }
  if (tagObject.key != null && isBlank(tagObject.key)) {
    return secondKeyMayNotBeMissingError;
  }
}

const tagNeedsToBeSelectedError = createValidationError('A tag needs to be selected.');
const secondKeyMayNotBeMissingError = createValidationError('A key needs to be specified.');

export const validatorForType = {
  [staticStringType]: nonBlankValidator,
  [staticNumberType]: longNumberValidator,
  [dynamicType]: needsTagAndSecondKeyMayNotBeMissingValidator
};

function createFormFieldForField(field) {
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
        value: field.type ?? defaultType
      })
    )
    .put(
      'value',
      createField({
        value: field.value ?? defaultValueForType(field.type ?? defaultType),
        validator: validatorForType[field.type ?? defaultType] ?? undefined
      })
    );
}

export function defaultValueForType(type) {
  const defaultValues = {
    [staticBooleanType]: false,
    [staticNumberType]: 0,
    [dynamicType]: {}
  };
  return defaultValues[type] ?? '';
}

export function createNewFormEntry() {
  return createFormFieldForField(enrichedWithUniqId({}));
}

export function createForm(payloadFields) {
  let fields = createListForm({
    validator: onlyUniqueKeyNames
  });
  payloadFields.forEach(payloadField => {
    fields = fields.push(createFormFieldForField(payloadField));
  });
  if (!payloadFields.length) {
    // minimal empty entry, when nothing was specified yet
    fields = fields.push(createNewFormEntry());
  }
  return fields;
}

function onlyUniqueKeyNames(payloadItems) {
  if (!payloadItems) return;

  const keys = payloadItems.map(item => item.get('key').value).filter(isNotBlank);
  const keySet = new Set(keys);
  if (keys.length > keySet.size) {
    return keyNamesMustBeUnique;
  }
}

const keyNamesMustBeUnique = createValidationError('Key names must be unique.');
