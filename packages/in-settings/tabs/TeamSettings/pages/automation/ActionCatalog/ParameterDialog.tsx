/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';
import { OnEntityChange, SetForm } from 'in-settings/hooks/useEntityForm';
import { ActionFormEntity } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import { createField, createMapForm, Field, MapForm } from 'formalistic';
import { Parameter } from '@instana/types';
import { notBlankValidator } from 'in-services/validators/string';
import Form from 'in-components/form/binding/Form';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup/FormGroup';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';

import locals from './ActionForm.mless';
import { Toggle } from '@instana/components';
import Select from 'in-components/form/Select/Select';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import SaveCancel from 'in-settings/components/SaveCancel';
import Password from 'in-components/form/Password/Password';

interface ParameterDialogProps {
  form: MapForm;
  onChange: OnEntityChange<ActionFormEntity>;
  setForm: SetForm;
  nameToEdit?: string;
}

export default function ParameterDialog({ form, setForm, onChange, nameToEdit }: ParameterDialogProps) {
  const parameter = (form.get('parameters') as Field<Parameter[]>).value.find(
    parameter => parameter.name === nameToEdit
  );
  const [parameterForm, setParameterForm] = useState(createForm());

  const name = parameterForm.get('name') as Field<string>;
  const label = parameterForm.get('label') as Field<string>;
  const description = parameterForm.get('description') as Field<string>;
  const required = parameterForm.get('required') as Field<boolean>;
  const hidden = parameterForm.get('hidden') as Field<boolean>;
  const secured = parameterForm.get('secured') as Field<boolean>;
  const isStatic = parameterForm.get('isStatic') as Field<boolean>;
  const value = parameterForm.get('value') as Field<string>;
  const onSubmit = (...args: any) => {
    console.log(args);
  };
  console.log(form, setForm, onChange, setParameterForm, parameterForm);
  const valueRequiredButEmpty = required.value && value.touched && value.value === '';
  const DefaultValueInput = secured.value ? Password : Input;
  return (
    <Dialog
      titleIconType={'lib_openclose_add'}
      title={t('in-settings:tabs.addParameter')}
      onClose={close}
      withoutBodyPadding
    >
      <div style={{ height: '100%', padding: '0 1.5rem' }}>
        <Form
          form={parameterForm}
          setForm={form => setParameterForm(form as MapForm)}
          formId="action-parameter-form"
          onSubmit={onSubmit}
        >
          <FormGroup>
            <Label htmlFor="parameter-name" hasError={!name.valid && name.touched}>
              {t('in-settings:tabs.name')}
            </Label>
            <Input
              id="parameter-name"
              type="text"
              value={name.value}
              onChange={e => onParameterChange('name', e.target.value)}
              hasError={!name.valid && name.touched}
              maxLength={256}
            />
            <TouchedMessages field={name} className={locals.subErrorTextFormField} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="parameter-label" hasError={!label.valid && label.touched}>
              {t('in-settings:tabs.label')}
            </Label>
            <Input
              id="parameter-label"
              type="text"
              value={label.value}
              onChange={e => onParameterChange('label', e.target.value)}
              hasError={!label.valid && label.touched}
              maxLength={256}
            />
            <TouchedMessages field={label} className={locals.subErrorTextFormField} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="parameter-description" hasError={!description.valid && description.touched}>
              {t('in-settings:tabs.description')}
            </Label>
            <Input
              id="parameter-description"
              type="text"
              value={description.value}
              onChange={e => onParameterChange('description', e.target.value)}
              hasError={!description.valid && description.touched}
              maxLength={256}
            />
            <TouchedMessages field={description} className={locals.subErrorTextFormField} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="parameter-required" hasError={!required.valid && required.touched}>
              {t('in-settings:tabs.required')}
            </Label>
            <Toggle
              id="parameter-required"
              checked={required.value}
              onChange={e => onParameterChange('required', e.target.checked)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="parameter-valueType" hasError={!isStatic.valid && isStatic.touched}>
              {t('in-settings:tabs.valueType')}
            </Label>
            <Select id="parameter-valueType" onChange={e => onParameterChange('isStatic', e.target.value === 'true')}>
              <option value={'true'}>Static</option>
              <option value={'false'}>Dynamic</option>
            </Select>
          </FormGroup>
          {isStatic.value && (
            <>
              <FormGroup>
                <Label htmlFor="parameter-value" hasError={!value.valid && value.touched}>
                  {t('in-settings:tabs.defaultValue')}
                </Label>
                <DefaultValueInput
                  id="parameter-value"
                  value={value.value}
                  onChange={e => onParameterChange('value', e.target.value)}
                  hasError={valueRequiredButEmpty}
                  maxLength={256}
                />
                {valueRequiredButEmpty && (
                  <ValidationBlock>{t('in-services:validators.theValueMustNotBeBlank')}</ValidationBlock>
                )}
              </FormGroup>
              <Row>
                <Col lg={4}>
                  <FormGroup>
                    <Label htmlFor="parameter-hidden" hasError={!hidden.valid && hidden.touched}>
                      {t('in-settings:tabs.hiddenParam')}
                    </Label>
                    <Toggle
                      id="parameter-hidden"
                      checked={hidden.value}
                      onChange={e => onParameterChange('hidden', e.target.checked)}
                    />
                  </FormGroup>
                </Col>
                <Col lg={4}>
                  <FormGroup>
                    <Label htmlFor="parameter-secured" hasError={!secured.valid && secured.touched}>
                      {t('in-settings:tabs.secured')}
                    </Label>
                    <Toggle
                      id="parameter-secured"
                      checked={secured.value}
                      onChange={e => onParameterChange('secured', e.target.checked)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}
          <SaveCancel form={parameterForm} onClickCancelButton={close} saveEnabled={!valueRequiredButEmpty} />
        </Form>
      </div>
    </Dialog>
  );
  function onParameterChange<T>(fieldName: string, value: T) {
    setParameterForm(form => form.updateIn([fieldName], field => (field as Field<T>).setValue(value).setTouched(true)));
  }
  function createForm() {
    return createMapForm()
      .put(
        'name',
        createField({
          value: parameter?.name ?? '',
          validator: notBlankValidator
        })
      )
      .put(
        'label',
        createField({
          value: parameter?.label ?? '',
          validator: notBlankValidator
        })
      )
      .put(
        'description',
        createField({
          value: parameter?.description ?? '',
          validator: notBlankValidator
        })
      )
      .put(
        'required',
        createField({
          value: parameter?.required ?? false
        })
      )
      .put(
        'hidden',
        createField({
          value: parameter?.hidden ?? false
        })
      )
      .put(
        'secured',
        createField({
          value: parameter?.secured ?? false
        })
      )
      .put(
        'isStatic',
        createField({
          value: parameter?.isStatic ?? true
        })
      )
      .put(
        'value',
        createField({
          value: parameter?.value ?? ''
        })
      );
  }
}
