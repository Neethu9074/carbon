/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, ValidationResult } from 'formalistic';

import { ParameterDialogProps } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ParameterDialog';
import { MappedParameter } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ParametersTable';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

interface CreateFormParams extends Pick<ParameterDialogProps, 'form' | 'idToEdit'> {
  parameter: MappedParameter | undefined;
}

export function createForm({ parameter, form, idToEdit }: CreateFormParams) {
  let newForm = createMapForm()
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
        value: parameter?.value?.description ?? '',
        validator: notBlankValidator
      })
    )
    .put(
      'required',
      createField({
        value: parameter?.value?.type === 'static' ? parameter?.value?.required ?? false : false
      })
    )
    .put(
      'hidden',
      createField({
        value: parameter?.value?.type === 'static' ? parameter?.value?.hidden ?? false : false
      })
    )
    .put(
      'type',
      createField({
        value: parameter?.value?.type ?? 'static'
      })
    );
  if (parameter?.value?.type === 'vault') {
    newForm = addVaultFields({ parameter, form: newForm });
  } else {
    newForm = addStaticField({ parameter, form: newForm });
  }
  return newForm;
}

interface AddFieldsParams extends Pick<ParameterDialogProps, 'form'> {
  parameter: MappedParameter | undefined;
}

export function addStaticField({ parameter, form }: AddFieldsParams) {
  return form
    .put(
      'value',
      createField({
        value: parameter?.value?.type === 'static' ? parameter?.value?.value ?? '' : ''
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
        validator: notBlankValidator
      })
    )
    .put(
      'secretPath',
      createField({
        value: secretPath ?? '',
        validator: notBlankValidator
      })
    )
    .remove('value');
}

function validName(value: string): ValidationResult {
  if (!/^[a-zA-Z_]{1,}[a-zA-Z0-9_]*$/.test(value)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.validName')
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
        message: t('in-settings:tabs.uniqueName')
      }
    ];
  }
  return undefined;
}
