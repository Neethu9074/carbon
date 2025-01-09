/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { RadioButton, Checkbox, Spacer } from '@instana/components';
import { Parameter, DynamicFieldValue } from '@instana/types';
import { generateUniqueShortId } from '@instana/utils';

import {
  ViewModel,
  createTagBasedPayloadConfigurator,
  toFormModel,
  toViewModel
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import {
  createForm,
  addStaticField,
  addVaultFields,
  mutateFieldBlankValidator,
  addDynamicFields,
  emptyObjectValidator
} from 'in-automation/ActionCatalog/ParameterFormDefinition';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { MappedParameter } from 'in-automation/ActionCatalog/ParametersTable';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import FormGroup from 'in-settings/components/FormGroup/FormGroup';
import { getDynamicParameterTagCatalog } from 'in-automation/api';
import { OnChange } from 'in-automation/ActionCatalog/Action';
import { close } from 'in-components/DialogPresenter/store';
import HelpText from 'in-components/form/HelpText/HelpText';
import SaveCancel from 'in-settings/components/SaveCancel';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import Form from 'in-components/form/binding/Form';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import Dialog from 'in-components/Dialog/Dialog';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Action.mless';

export interface ParameterDialogProps {
  form: MapForm<any>;
  onChange: OnChange;
  idToEdit?: string;
  isNotEditable: boolean;
  isAnsible: boolean;
  isGitOrJira: boolean;
}

export default function ParameterDialog({
  form,
  onChange,
  idToEdit,
  isNotEditable,
  isAnsible,
  isGitOrJira = false
}: ParameterDialogProps) {
  const parameter = (form.get('parameters') as Field<MappedParameter[]>).value.find(
    parameter => parameter.id === idToEdit
  );

  const [parameterForm, setParameterForm] = useState(createForm({ parameter, form, idToEdit }));

  const type = parameterForm.get('type') as Field<string>;
  const parameterName = parameterForm.get('name') as Field<string>;
  const disableTicketIdParameter = isGitOrJira && parameterName.value === 'id';
  // IMPORTANT: Ansible actions are a special case where we want to allow the parameters to be editable EXCEPT for the name so we override isNotEditable so that everything is editable except for the name where we will disable the input using isAnsible flag
  isNotEditable = isNotEditable && !isAnsible;

  const sectionProps = {
    parameterForm,
    setParameterForm,
    parameter,
    form,
    isNotEditable
  };

  return (
    <Dialog
      titleIconType={idToEdit ? 'lib_actions_edit' : 'lib_openclose_add'}
      title={idToEdit ? t('in-automation:ActionCatalog.editParameter') : t('in-automation:ActionCatalog.addParameter')}
      onClose={close}
      withoutBodyPadding
    >
      <div className={locals.parameterDialog}>
        <Form
          form={parameterForm}
          setForm={form => setParameterForm(form as MapForm<any>)}
          formId="action-parameter-form"
          onSubmit={parameterForm =>
            onSubmit({ parameterForm: parameterForm as MapForm<any>, parameter, form, onChange, idToEdit })
          }
        >
          <MetaDataSection
            {...sectionProps}
            isAnsible={isAnsible}
            disableTicketIdParameter={disableTicketIdParameter}
          />
          {type.value === 'static' && <StaticSection {...sectionProps} isAnsible={isAnsible} />}
          {type.value === 'vault' && <VaultSection {...sectionProps} />}
          {type.value === 'dynamic' && <DynamicSection {...sectionProps} />}
          {type.value !== 'dynamic' && <HiddenSection {...sectionProps} />}
          <SaveCancel
            hasSaveButton={!isNotEditable && role?.canConfigureAutomationActions}
            form={parameterForm}
            onClickCancelButton={close}
          />
        </Form>
      </div>
    </Dialog>
  );
}

interface SectionProps {
  parameter: MappedParameter | undefined;
  parameterForm: MapForm<any>;
  setParameterForm: React.Dispatch<React.SetStateAction<MapForm<any>>>;
  isNotEditable: boolean;
}

function MetaDataSection({
  parameter,
  parameterForm,
  setParameterForm,
  isNotEditable,
  isAnsible,
  disableTicketIdParameter
}: SectionProps & { isAnsible: boolean; disableTicketIdParameter: boolean }) {
  const name = parameterForm.get('name') as Field<string>;
  const label = parameterForm.get('label') as Field<string>;
  const description = parameterForm.get('description') as Field<string>;
  const type = parameterForm.get('type') as Field<string>;
  const required = parameterForm.get('required') as Field<boolean>;
  const hidden = parameterForm.get('hidden') as Field<boolean>;
  isNotEditable = (isNotEditable && !isAnsible) || !role?.canConfigureAutomationActions;

  return (
    <>
      <FormGroup>
        <Label htmlFor="parameter-label" hasError={!label.valid && label.touched}>
          {t('in-automation:ActionCatalog.displayName')}
        </Label>
        <Input
          id="parameter-label"
          type="text"
          disabled={isNotEditable}
          value={label.value}
          onChange={e => onParameterChange({ fieldName: 'label', value: e.target.value, setParameterForm, parameter })}
          hasError={!label.valid && label.touched}
          maxLength={256}
        />
        <TouchedMessages field={label} className={locals.subErrorTextFormField} />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="parameter-name" hasError={!name.valid && name.touched}>
          {t('in-automation:name')}
        </Label>
        <Input
          id="parameter-name"
          type="text"
          // IMPORTANT: isNotEditable has been overridden for Ansible actions so we need to check isAnsible here to disable the input
          disabled={isNotEditable || isAnsible || disableTicketIdParameter}
          value={name.value}
          onChange={e => onParameterChange({ fieldName: 'name', value: e.target.value, setParameterForm, parameter })}
          hasError={!name.valid && name.touched}
          maxLength={256}
        />
        <TouchedMessages field={name} className={locals.subErrorTextFormField} />
        <HelpText className={locals.subTextFormField}>{t('in-automation:ActionCatalog.parameterNameHelp')}</HelpText>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="parameter-description" hasError={!description.valid && description.touched}>
          {t('in-automation:description')}
        </Label>
        <Input
          id="parameter-description"
          type="text"
          disabled={isNotEditable}
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
        <Label htmlFor="parameter-type">{t('in-automation:ActionCatalog.valueType')}</Label>
        <Row withoutSideMargin>
          <Col>
            <RadioButton
              checked={type.value === 'static'}
              disabled={isNotEditable}
              label={t('in-automation:static')}
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
          <Spacer horizontal="small" />
          <Col>
            <RadioButton
              checked={type.value === 'vault'}
              disabled={isNotEditable}
              label={t('in-automation:vault')}
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
          <Spacer horizontal="small" />
          <Col>
            <RadioButton
              checked={type.value === 'dynamic'}
              disabled={isNotEditable}
              label={t('in-automation:dynamic')}
              onChange={() =>
                onParameterChange({
                  fieldName: 'type',
                  value: 'dynamic',
                  setParameterForm,
                  parameter,
                  updateFormDefinition: addDynamicFields
                })
              }
            />
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <Checkbox
          disabled={hidden.value || isNotEditable || disableTicketIdParameter}
          checked={required.value}
          label={t('in-automation:ActionCatalog.required')}
          onChange={e =>
            onParameterChange({ fieldName: 'required', value: e.target.checked, setParameterForm, parameter })
          }
        />
      </FormGroup>
    </>
  );
}

function HiddenSection({ parameter, parameterForm, setParameterForm, isNotEditable }: SectionProps) {
  const hidden = parameterForm.get('hidden') as Field<boolean>;
  const type = parameterForm.get('type') as Field<string>;

  return (
    <FormGroup>
      <Checkbox
        checked={hidden.value}
        disabled={isNotEditable}
        label={t('in-automation:ActionCatalog.hiddenParam')}
        onChange={e =>
          onParameterChange({
            fieldName: 'hidden',
            value: e.target.checked,
            setParameterForm,
            parameter,
            updateFormDefinition: ({ form }) => {
              if (e.target.checked) {
                form = form.updateIn(['required'], field => (field as Field<boolean>).setValue(true).setTouched(true));
              }
              if (type.value === 'static') {
                form = mutateFieldBlankValidator({ form, key: 'value', add: e.target.checked });
              } else if (type.value === 'dynamic') {
                form = mutateFieldBlankValidator({
                  form,
                  key: 'value',
                  add: e.target.checked,
                  validatorForField: emptyObjectValidator
                });
              } else if (type.value === 'vault') {
                form = mutateFieldBlankValidator({ form, key: 'secretPath', add: e.target.checked });
                form = mutateFieldBlankValidator({ form, key: 'secretKey', add: e.target.checked });
              }
              return form;
            }
          })
        }
      />
    </FormGroup>
  );
}

function StaticSection({
  parameter,
  parameterForm,
  setParameterForm,
  isNotEditable,
  isAnsible
}: SectionProps & { isAnsible: boolean }) {
  const hidden = parameterForm.get('hidden') as Field<boolean>;
  const value = parameterForm.get('value') as Field<string>;
  isNotEditable = (isNotEditable && !isAnsible) || !role?.canConfigureAutomationActions;
  return (
    <>
      <FormGroup>
        <Label htmlFor="parameter-value" hasError={!value.valid && value.touched}>
          {hidden.value
            ? t('in-automation:ActionCatalog.defaultValue')
            : t('in-automation:ActionCatalog.defaultValueOptional')}
        </Label>
        <Input
          id="parameter-value"
          disabled={isNotEditable}
          value={value.value}
          onChange={e => onParameterChange({ fieldName: 'value', value: e.target.value, setParameterForm, parameter })}
          hasError={!value.valid && value.touched}
          maxLength={256}
        />
        <TouchedMessages field={value} className={locals.subErrorTextFormField} />
      </FormGroup>
    </>
  );
}

function VaultSection({ parameter, parameterForm, setParameterForm, isNotEditable }: SectionProps) {
  const hidden = parameterForm.get('hidden') as Field<boolean>;
  const secretPath = parameterForm.get('secretPath') as Field<string>;
  const secretKey = parameterForm.get('secretKey') as Field<string>;

  return (
    <>
      <FormGroup>
        <Label htmlFor="parameter-secretPath" hasError={!secretPath.valid && secretPath.touched}>
          {hidden.value
            ? t('in-automation:ActionCatalog.secretPath')
            : t('in-automation:ActionCatalog.secretPathOptional')}
        </Label>
        <Input
          id="parameter-secretPath"
          disabled={isNotEditable}
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
          {hidden.value
            ? t('in-automation:ActionCatalog.secretKey')
            : t('in-automation:ActionCatalog.secretKeyOptional')}
        </Label>
        <Input
          id="parameter-secretKey"
          disabled={isNotEditable}
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
}

export const TagBasedPayloadConfigurator = createTagBasedPayloadConfigurator({
  getTagCatalog: getDynamicParameterTagCatalog,
  getSuggestions: ({ name, timeConfig, tagFilterExpression }) =>
    getTagSuggestions({
      tagName: name,
      entity: DESTINATION,
      filter: {
        includeInternalCalls: false,
        includeSyntheticCalls: false,
        timeConfig: timeConfig,
        useLongTermDataOnly: false
      },
      requestingSecondaryKeySuggestions: true,
      tagFilterExpression: tagFilterExpression ?? EMPTY_EXPRESSION
    })
});

function DynamicSection({ parameter, parameterForm, setParameterForm, isNotEditable }: SectionProps) {
  const value = parameterForm.get('value') as Field<DynamicFieldValue>;
  return (
    <FormGroup>
      <Label htmlFor="parameter-secretPath" hasError={!value.valid && value.touched}>
        {t('in-automation:value')}
      </Label>
      <div>
        <TagBasedPayloadConfigurator
          value={toViewModel(value.value)}
          disabled={isNotEditable}
          onChange={(viewModel: ViewModel) =>
            onParameterChange({ fieldName: 'value', value: toFormModel(viewModel), setParameterForm, parameter })
          }
          tagFilterExpression={EMPTY_EXPRESSION}
        />
      </div>
      <TouchedMessages field={value} className={locals.subErrorTextFormField} />
    </FormGroup>
  );
}

interface OnParameterChangeParams<T> {
  fieldName: string;
  value: T;
  setParameterForm: React.Dispatch<React.SetStateAction<MapForm<any>>>;
  parameter: MappedParameter | undefined;
  updateFormDefinition?: ({
    form,
    parameter
  }: {
    form: MapForm<any>;
    parameter: MappedParameter | undefined;
  }) => MapForm<any>;
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

interface OnSubmitParams extends Omit<ParameterDialogProps, 'isNotEditable' | 'isAnsible' | 'isGitOrJira'> {
  parameterForm: MapForm<any>;
  parameter: MappedParameter | undefined;
}

function onSubmit({ parameterForm, parameter, form, onChange, idToEdit }: OnSubmitParams) {
  const name = (parameterForm.get('name') as Field<string>).value;
  const label = (parameterForm.get('label') as Field<string>).value;
  const description = (parameterForm.get('description') as Field<string>).value;
  const required = (parameterForm.get('required') as Field<boolean>).value;
  const hidden = (parameterForm.get('hidden') as Field<boolean>).value;
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
  } else if (type === 'dynamic') {
    const value = (parameterForm.get('value') as Field<DynamicFieldValue>).value;
    paramValue = JSON.stringify(value);
    valueType = 'map';
  }
  const parameterToSubmit: Parameter = {
    name,
    label,
    description,
    required,
    hidden,
    value: paramValue,
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
