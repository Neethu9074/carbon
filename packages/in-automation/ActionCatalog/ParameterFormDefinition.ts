/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, MapForm, ValidationResult } from 'formalistic';
import { isEmpty } from 'lodash';

import { DynamicFieldValue } from '@instana/types';

import { needsTagAndSecondKeyMayNotBeMissingValidator } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { ParameterDialogProps } from 'in-automation/ActionCatalog/ParameterDialog';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { MappedParameter } from 'in-automation/ActionCatalog/ParametersTable';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

interface CreateFormParams extends Pick<ParameterDialogProps, 'form' | 'idToEdit'> {
  parameter: MappedParameter | undefined;
}

export function createForm({ parameter, form, idToEdit }: CreateFormParams) {
  const newForm: MapForm<any> = createMapForm()
    .put(
      'name',
      createField({
        value: parameter?.value?.name ?? '',
        validator: composeAndShortCircuitOnError(notBlankValidator, validName, (value: string) =>
          uniqueName((form.get('parameters') as Field<MappedParameter[]>).value, value, idToEdit ?? '')
        )
      })
    )
    .put(
      'label',
      createField({
        value: parameter?.value?.label ?? '',
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: parameter?.value?.description ?? ''
      })
    )
    .put(
      'required',
      createField({
        value: parameter?.value?.required ?? false
      })
    )
    .put(
      'hidden',
      createField({
        value: parameter?.value?.hidden ?? false
      })
    )
    .put(
      'type',
      createField({
        value: parameter?.value?.type ?? 'static'
      })
    );

  if (parameter?.value?.type === 'vault') {
    return addVaultFields({ parameter, form: newForm });
  } else if (parameter?.value?.type === 'dynamic') {
    return addDynamicFields({ parameter, form: newForm });
  } else {
    return addStaticField({ parameter, form: newForm });
  }
}

interface AddFieldsParams extends Pick<ParameterDialogProps, 'form'> {
  parameter: MappedParameter | undefined;
}

function getValidator(form: MapForm<any>, validator: (...args: any) => ValidationResult) {
  return (form.get('hidden') as Field<boolean>).value ? validator : undefined;
}

export function addStaticField({ parameter, form }: AddFieldsParams) {
  return form
    .remove('value')
    .put(
      'value',
      createField({
        value: parameter?.value?.type === 'static' ? parameter?.value?.value ?? '' : '',
        validator: getValidator(form, notBlankValidator),
        touched: form.touched
      })
    )
    .remove('secretKey')
    .remove('secretPath');
}

export function addVaultFields({ parameter, form }: AddFieldsParams) {
  const parsedVaultValue: { secretKey?: string; secretPath?: string } = (raw => {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  })(parameter?.value?.value ?? '{}');
  const { secretKey, secretPath } = parsedVaultValue;
  return form
    .put(
      'secretKey',
      createField({
        value: secretKey ?? '',
        validator: getValidator(form, notBlankValidator),
        touched: form.touched
      })
    )
    .put(
      'secretPath',
      createField({
        value: secretPath ?? '',
        validator: getValidator(form, notBlankValidator),
        touched: form.touched
      })
    )
    .remove('value');
}

export function addDynamicFields({ parameter, form }: AddFieldsParams) {
  const parsedDynamicValue: DynamicFieldValue = (raw => {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  })(parameter?.value?.value ?? '{}');

  return form
    .remove('value')
    .updateIn(['hidden'], f => f.setValue(false))
    .put(
      'value',
      createField({
        value: parsedDynamicValue,
        validator: needsTagAndSecondKeyMayNotBeMissingValidator,
        touched: form.touched
      })
    )
    .remove('secretKey')
    .remove('secretPath');
}

export function mutateFieldBlankValidator({
  form,
  key,
  add,
  validatorForField = notBlankValidator
}: {
  form: MapForm<any>;
  key: string;
  add: boolean;
  validatorForField?: (...args: any) => ValidationResult;
}) {
  const { value, touched } = form.get(key) as Field<string>;
  const validator = add ? validatorForField : undefined;
  return form.remove(key).put(
    key,
    createField({
      value,
      validator: validator,
      touched
    })
  );
}

export function emptyObjectValidator(value: DynamicFieldValue): ValidationResult {
  if (isEmpty(value)) {
    return [
      {
        severity: 'error',
        message: t('in-automation:theValueMustNotBeBlank')
      }
    ];
  }
  return undefined;
}

function validName(value: string): ValidationResult {
  if (!/^[a-zA-Z_]{1,}[a-zA-Z0-9_]*$/.test(value)) {
    return [
      {
        severity: 'error',
        message: t('in-automation:ActionCatalog.validName')
      }
    ];
  }
  return undefined;
}

function uniqueName(parameters: MappedParameter[], value: string, id: string): ValidationResult {
  if (parameters.some(parameter => parameter.value.name === value && parameter.id !== id)) {
    return [
      {
        severity: 'error',
        message: t('in-automation:ActionCatalog.uniqueName')
      }
    ];
  }
  return undefined;
}
