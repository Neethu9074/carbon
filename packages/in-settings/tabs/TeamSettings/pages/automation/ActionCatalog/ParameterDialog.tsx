/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { Parameter } from '@instana/types';

import {
  createForm,
  addStaticField,
  addVaultFields
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ParameterFormDefinition';
import { MappedParameter } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ParametersTable';
import { ActionFormEntity } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import FormGroup from 'in-settings/components/FormGroup/FormGroup';
import { OnEntityChange } from 'in-settings/hooks/useEntityForm';
import { close } from 'in-components/DialogPresenter/store';
import HelpText from 'in-components/form/HelpText/HelpText';
import SaveCancel from 'in-settings/components/SaveCancel';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Form from 'in-components/form/binding/Form';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './ActionForm.mless';

export interface ParameterDialogProps {
  form: MapForm;
  onChange: OnEntityChange<ActionFormEntity>;
  idToEdit?: string;
}

export default function ParameterDialog({ form, onChange, idToEdit }: ParameterDialogProps) {
  const parameter = (form.get('parameters') as Field<MappedParameter[]>).value.find(
    parameter => parameter.id === idToEdit
  );

  const [parameterForm, setParameterForm] = useState(createForm({ parameter, form, idToEdit }));

  const hidden = parameterForm.get('hidden') as Field<boolean>;
  const value = parameterForm.get('value') as Field<string>;
  const type = parameterForm.get('type') as Field<string>;

  const valueHiddenButEmpty = type.value === 'static' && hidden.value && value.value === '';
  return (
    <Dialog
      titleIconType={'lib_openclose_add'}
      title={t('in-settings:tabs.addParameter')}
      onClose={close}
      withoutBodyPadding
    >
      <div className={locals.parameterDialog}>
        <Form
          form={parameterForm}
          setForm={form => setParameterForm(form as MapForm)}
          formId="action-parameter-form"
          onSubmit={parameterForm =>
            onSubmit({ parameterForm: parameterForm as MapForm, parameter, form, onChange, idToEdit })
          }
        >
          <MetaDataSection parameterForm={parameterForm} setParameterForm={setParameterForm} parameter={parameter} />
          {type.value === 'static' && (
            <StaticSection
              parameterForm={parameterForm}
              setParameterForm={setParameterForm}
              parameter={parameter}
              valueHiddenButEmpty={valueHiddenButEmpty}
            />
          )}
          {type.value === 'vault' && (
            <VaultSection parameterForm={parameterForm} setParameterForm={setParameterForm} parameter={parameter} />
          )}
          <SaveCancel form={parameterForm} onClickCancelButton={close} saveEnabled={!valueHiddenButEmpty} />
        </Form>
      </div>
    </Dialog>
  );
}

interface SectionProps {
  parameter: MappedParameter | undefined;
  parameterForm: MapForm;
  setParameterForm: React.Dispatch<React.SetStateAction<MapForm>>;
}

const MetaDataSection = ({ parameter, parameterForm, setParameterForm }: SectionProps) => {
  const name = parameterForm.get('name') as Field<string>;
  const label = parameterForm.get('label') as Field<string>;
  const description = parameterForm.get('description') as Field<string>;
  const type = parameterForm.get('type') as Field<string>;
  return (
    <>
      <FormGroup>
        <Label htmlFor="parameter-label" hasError={!label.valid && label.touched}>
          {t('in-settings:tabs.displayName')}
        </Label>
        <Input
          id="parameter-label"
          type="text"
          value={label.value}
          onChange={e => onParameterChange({ fieldName: 'label', value: e.target.value, setParameterForm, parameter })}
          hasError={!label.valid && label.touched}
          maxLength={256}
        />
        <TouchedMessages field={label} className={locals.subErrorTextFormField} />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="parameter-name" hasError={!name.valid && name.touched}>
          {t('in-settings:tabs.name')}
        </Label>
        <Input
          id="parameter-name"
          type="text"
          value={name.value}
          onChange={e => onParameterChange({ fieldName: 'name', value: e.target.value, setParameterForm, parameter })}
          hasError={!name.valid && name.touched}
          maxLength={256}
        />
        <TouchedMessages field={name} className={locals.subErrorTextFormField} />
        <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.parameterNameHelp')}</HelpText>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="parameter-description" hasError={!description.valid && description.touched}>
          {t('in-settings:tabs.description')}
        </Label>
        <Input
          id="parameter-description"
          type="text"
          value={description.value}
          onChange={e =>
            onParameterChange({ fieldName: 'description', value: e.target.value, setParameterForm, parameter })
          }
          hasError={!description.valid && description.touched}
          maxLength={256}
        />
        <TouchedMessages field={description} className={locals.subErrorTextFormField} />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="parameter-type">{t('in-settings:tabs.valueType')}</Label>
        <Row withoutSideMargin>
          <Col>
            <CheckboxFancy
              asRadioButton
              checked={type.value === 'static'}
              label={t('in-settings:tabs.static')}
              onChange={() =>
                onParameterChange({
                  fieldName: 'type',
                  value: 'static',
                  setParameterForm,
                  parameter,
                  updateFormDefinition: addStaticField
                })
              }
            />
          </Col>
          {/* <Col>
            <CheckboxFancy
              asRadioButton
              checked={type.value === 'dynamic'}
              label={t('in-settings:tabs.dynamic')}
              onChange={() => onParameterChange({ fieldName: 'type', value: 'dynamic', setParameterForm, parameter })}
            />
          </Col> */}
          <Col>
            <CheckboxFancy
              asRadioButton
              checked={type.value === 'vault'}
              label={t('in-settings:tabs.vault')}
              onChange={() =>
                onParameterChange({
                  fieldName: 'type',
                  value: 'vault',
                  setParameterForm,
                  parameter,
                  updateFormDefinition: addVaultFields
                })
              }
            />
          </Col>
        </Row>
      </FormGroup>
    </>
  );
};

const StaticSection = ({
  parameter,
  parameterForm,
  setParameterForm,
  valueHiddenButEmpty
}: SectionProps & { valueHiddenButEmpty: boolean }) => {
  const required = parameterForm.get('required') as Field<boolean>;
  const hidden = parameterForm.get('hidden') as Field<boolean>;
  const value = parameterForm.get('value') as Field<string>;
  const valueHiddenButEmptyAndTouched = valueHiddenButEmpty && value.touched;

  return (
    <>
      <FormGroup>
        <CheckboxFancy
          disabled={hidden.value}
          checked={required.value}
          label={t('in-settings:tabs.required')}
          onChange={e =>
            onParameterChange({ fieldName: 'required', value: e.target.checked, setParameterForm, parameter })
          }
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="parameter-value" hasError={valueHiddenButEmptyAndTouched}>
          {hidden.value ? t('in-settings:tabs.defaultValue') : t('in-settings:tabs.defaultValueOptional')}
        </Label>
        <Input
          id="parameter-value"
          value={value.value}
          onChange={e => onParameterChange({ fieldName: 'value', value: e.target.value, setParameterForm, parameter })}
          hasError={valueHiddenButEmptyAndTouched}
          maxLength={256}
        />
        {valueHiddenButEmptyAndTouched && (
          <ValidationBlock>{t('in-services:validators.theValueMustNotBeBlank')}</ValidationBlock>
        )}
      </FormGroup>
      <FormGroup>
        <CheckboxFancy
          checked={hidden.value}
          label={t('in-settings:tabs.hiddenParam')}
          onChange={e =>
            onParameterChange({
              fieldName: 'hidden',
              value: e.target.checked,
              setParameterForm,
              parameter,
              updateFormDefinition: ({ form }) => {
                if (e.target.checked) {
                  form = form.updateIn(['required'], field =>
                    (field as Field<boolean>).setValue(e.target.checked).setTouched(true)
                  );
                }
                return form;
              }
            })
          }
        />
      </FormGroup>
    </>
  );
};

const VaultSection = ({ parameter, parameterForm, setParameterForm }: SectionProps) => {
  const secretKey = parameterForm.get('secretKey') as Field<string>;
  const secretPath = parameterForm.get('secretPath') as Field<string>;

  return (
    <>
      <FormGroup>
        <Label htmlFor="parameter-secretPath" hasError={!secretPath.valid && secretPath.touched}>
          {t('in-settings:tabs.secretPath')}
        </Label>
        <Input
          id="parameter-secretPath"
          value={secretPath.value}
          onChange={e =>
            onParameterChange({ fieldName: 'secretPath', value: e.target.value, setParameterForm, parameter })
          }
          hasError={!secretPath.valid && secretPath.touched}
          maxLength={256}
        />
        <TouchedMessages field={secretPath} className={locals.subErrorTextFormField} />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="parameter-secretKey" hasError={!secretKey.valid && secretKey.touched}>
          {t('in-settings:tabs.secretKey')}
        </Label>
        <Input
          id="parameter-secretKey"
          value={secretKey.value}
          onChange={e =>
            onParameterChange({ fieldName: 'secretKey', value: e.target.value, setParameterForm, parameter })
          }
          hasError={!secretKey.valid && secretKey.touched}
          maxLength={256}
        />
        <TouchedMessages field={secretKey} className={locals.subErrorTextFormField} />
      </FormGroup>
    </>
  );
};
interface OnParameterChangeParams<T> {
  fieldName: string;
  value: T;
  setParameterForm: React.Dispatch<React.SetStateAction<MapForm>>;
  parameter: MappedParameter | undefined;
  updateFormDefinition?: ({ form, parameter }: { form: MapForm; parameter: MappedParameter | undefined }) => MapForm;
}

function onParameterChange<T>({
  fieldName,
  value,
  setParameterForm,
  parameter,
  updateFormDefinition
}: OnParameterChangeParams<T>) {
  setParameterForm(form => {
    form = form.updateIn([fieldName], field => (field as Field<T>).setValue(value).setTouched(true));
    if (updateFormDefinition) {
      form = updateFormDefinition({ form, parameter });
    }
    return form;
  });
}

interface OnSubmitParams extends ParameterDialogProps {
  parameterForm: MapForm;
  parameter: MappedParameter | undefined;
}

function onSubmit({ parameterForm, parameter, form, onChange, idToEdit }: OnSubmitParams) {
  const name = (parameterForm.get('name') as Field<string>).value;
  const label = (parameterForm.get('label') as Field<string>).value;
  const description = (parameterForm.get('description') as Field<string>).value;
  const required = (parameterForm.get('required') as Field<boolean>).value;
  const hidden = parameterForm.get('hidden') as Field<boolean>;
  const type = (parameterForm.get('type') as Field<string>).value;
  let paramValue = '';
  let valueType = '';
  if (type === 'static') {
    paramValue = (parameterForm.get('value') as Field<string>).value;
    valueType = 'string';
  } else if (type === 'vault') {
    const secretKey = (parameterForm.get('secretKey') as Field<string>).value;
    const secretPath = (parameterForm.get('secretPath') as Field<string>).value;
    paramValue = JSON.stringify({ secretKey: secretKey, secretPath: secretPath });
    valueType = 'map';
  }
  const parameterToSubmit: Parameter = {
    name,
    label,
    description,
    required: type === 'vault' ? true : required,
    hidden: hidden.value,
    value: paramValue,
    secured: false,
    type,
    valueType
  };
  const value = parameter
    ? ((form.get('parameters') as Field<MappedParameter[]>).value ?? []).map(p =>
        p.id === idToEdit ? { id: idToEdit, value: parameterToSubmit } : p
      )
    : [
        ...((form.get('parameters') as Field<MappedParameter[]>).value ?? []),
        { id: generateUniqueShortId(), value: parameterToSubmit }
      ];
  onChange('parameters', value);
  close();
}
