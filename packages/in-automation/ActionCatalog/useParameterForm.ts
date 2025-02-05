/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, MapForm, ValidationResult } from 'formalistic';
import { useState, useContext } from 'react';

import { Parameter } from '@instana/types';

import { needsTagAndSecondKeyMayNotBeMissingValidator } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { MappedParameter } from 'in-automation/ActionCatalog/useActionForm/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { FormContext } from 'in-components/form/binding/FormContext';
import { notBlankValidator } from 'in-services/validators/string';
import { safeParseJSON } from 'in-automation/utils/json';
import { t } from 'in-i18n';

type TagObject = {
  tagName: string | null | undefined;
  key?: string | null | undefined;
};

type VaultObject = { secretKey?: string; secretPath?: string };

type ParameterType = 'static' | 'dynamic' | 'vault';

type ParameterFormItems = {
  name: Field<string>;
  label: Field<string>;
  description: Field<string>;
  required: Field<boolean>;
  hidden: Field<boolean>;
  type: Field<ParameterType>;
  static: Field<string>;
  dynamic: Field<TagObject>;
  vault: MapForm<{
    secretKey: Field<string>;
    secretPath: Field<string>;
  }>;
};

export type ParameterForm = MapForm<ParameterFormItems>;

interface UseParameterFormParams {
  parameters: MappedParameter[];
  id?: string;
}

export default function useParameterForm({ parameters, id }: UseParameterFormParams) {
  const [form, setForm] = useState(createForm({ parameters, id }));
  function updateForm(setStateAction: React.SetStateAction<ParameterForm>) {
    setForm(prevForm => {
      const newForm = typeof setStateAction === 'function' ? setStateAction(prevForm) : setStateAction;
      return createForm({ parameters, form: newForm, id });
    });
  }
  return [form, updateForm] as const;
}

interface ParameterFormContext {
  form: ParameterForm;
  setForm: React.Dispatch<React.SetStateAction<ParameterForm>>;
}

export function useParameterFormContext() {
  const context = useContext(FormContext);

  if (context === undefined) {
    throw new Error('Must be used inside Form');
  }

  return context as ParameterFormContext;
}

function createForm({ parameters, form, id }: { parameters: MappedParameter[]; id?: string; form?: ParameterForm }) {
  if (form) return createFormFromForm(form, parameters, id);
  if (id) {
    const parameter = parameters.find(parameter => parameter.id === id)!;
    return createFormFromParameter(parameter, parameters, id);
  }
  return createDefaultForm(parameters);
}

function nameValidator(value: string): ValidationResult {
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

function uniqueNameValidator(value: string, parameters: MappedParameter[], id?: string): ValidationResult {
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

function createFormFromParameter(parameter: MappedParameter, parameters: MappedParameter[], id: string): ParameterForm {
  const { type, hidden = false, value, name, label, description = '', required = false } = parameter.value;

  const parsedValue = safeParseJSON(value);
  return createMapForm({
    items: {
      name: createField({
        value: name,
        validator: composeAndShortCircuitOnError(notBlankValidator, nameValidator, value =>
          uniqueNameValidator(value, parameters, id)
        )
      }),
      label: createField({
        value: label,
        validator: notBlankValidator
      }),
      description: createField({
        value: description
      }),
      required: createField({
        value: required
      }),
      hidden: createField({
        value: hidden
      }),
      type: createField<ParameterType>({
        value: type as ParameterType
      }),
      static: createField({
        value: type === 'static' ? value ?? '' : '',
        validator: type === 'static' && hidden === true ? notBlankValidator : undefined
      }),
      dynamic: createField({
        value: type === 'dynamic' ? (parsedValue as TagObject) : { tagName: null },
        validator: type === 'dynamic' ? needsTagAndSecondKeyMayNotBeMissingValidator : undefined
      }),
      vault: createMapForm({
        items: {
          secretKey: createField({
            value: type === 'vault' ? (parsedValue as VaultObject).secretKey ?? '' : '',
            validator: type === 'vault' && hidden === true ? notBlankValidator : undefined
          }),
          secretPath: createField({
            value: type === 'vault' ? (parsedValue as VaultObject).secretPath ?? '' : '',
            validator: type === 'vault' && hidden === true ? notBlankValidator : undefined
          })
        }
      })
    }
  });
}

function createFormFromForm(form: ParameterForm, parameters: MappedParameter[], id?: string): ParameterForm {
  const nameField = form.get('name');
  const labelField = form.get('label');
  const descriptionField = form.get('description');
  const requiredField = form.get('required');
  const typeField = form.get('type');
  const hiddenField = form.get('hidden');
  const staticField = form.get('static');
  const dynamicField = form.get('dynamic');
  const vaultField = form.get('vault');

  const secretKeyField = vaultField.get('secretKey');
  const secretPathField = vaultField.get('secretPath');

  return createMapForm({
    items: {
      name: createField({
        value: nameField.value,
        validator: composeAndShortCircuitOnError(notBlankValidator, nameValidator, value =>
          uniqueNameValidator(value, parameters, id)
        ),
        touched: nameField.touched
      }),
      label: createField({
        value: labelField.value,
        validator: notBlankValidator,
        touched: labelField.touched
      }),
      description: createField({
        value: descriptionField.value
      }),
      required: createField({
        value: requiredField.value
      }),
      hidden: createField({
        value: hiddenField.value
      }),
      type: createField({
        value: typeField.value
      }),
      static: createField({
        value: typeField.value === 'static' ? staticField.value : '',
        validator: typeField.value === 'static' && hiddenField.value === true ? notBlankValidator : undefined,
        touched: staticField.touched
      }),
      dynamic: createField({
        value: typeField.value === 'dynamic' ? dynamicField.value : { tagName: null },
        validator: typeField.value === 'dynamic' ? needsTagAndSecondKeyMayNotBeMissingValidator : undefined,
        touched: dynamicField.touched
      }),
      vault: createMapForm({
        items: {
          secretKey: createField({
            value: typeField.value === 'vault' ? secretKeyField.value : '',
            validator: typeField.value === 'vault' && hiddenField.value === true ? notBlankValidator : undefined,
            touched: secretKeyField.touched
          }),
          secretPath: createField({
            value: typeField.value === 'vault' ? secretPathField.value : '',
            validator: typeField.value === 'vault' && hiddenField.value === true ? notBlankValidator : undefined,
            touched: secretPathField.touched
          })
        }
      })
    }
  });
}

function createDefaultForm(parameters: MappedParameter[]): ParameterForm {
  return createMapForm({
    items: {
      name: createField({
        value: '',
        validator: composeAndShortCircuitOnError(notBlankValidator, nameValidator, value =>
          uniqueNameValidator(value, parameters, '')
        )
      }),
      label: createField({
        value: '',
        validator: notBlankValidator
      }),
      description: createField({
        value: ''
      }),
      required: createField({
        value: false
      }),
      hidden: createField({
        value: false
      }),
      type: createField<ParameterType>({
        value: 'static'
      }),
      static: createField({
        value: ''
      }),
      dynamic: createField<TagObject>({
        value: { tagName: null }
      }),
      vault: createMapForm({
        items: {
          secretKey: createField({
            value: ''
          }),
          secretPath: createField({
            value: ''
          })
        }
      })
    }
  });
}

function getParameterValueFromForm(form: ParameterForm) {
  const type = form.get('type').value;

  switch (type) {
    case 'static':
      return { value: form.get('static').value, valueType: 'string' };
    case 'dynamic': {
      const value = form.get('dynamic').value;
      return { value: JSON.stringify(value), valueType: 'map' };
    }
    case 'vault': {
      const vaultField = form.get('vault');
      const secretKey = vaultField.get('secretKey').value;
      const secretPath = vaultField.get('secretPath').value;
      return { value: JSON.stringify({ secretKey: secretKey, secretPath: secretPath }), valueType: 'map' };
    }
  }
}

export function getParameterFromForm(form: ParameterForm): Parameter {
  const name = form.get('name').value;
  const label = form.get('label').value;
  const description = form.get('description').value;
  const required = form.get('required').value;
  const hidden = form.get('hidden').value;
  const type = form.get('type').value;
  const { value, valueType } = getParameterValueFromForm(form);

  return {
    name,
    label,
    description,
    required,
    hidden,
    value,
    type,
    valueType
  };
}
