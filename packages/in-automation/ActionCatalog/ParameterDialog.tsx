/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { RadioButton, Checkbox, FormGroup } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { SidePanel } from '@instana/ibm-products';

import {
  toFormModel,
  toViewModel,
  ViewModel
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import useParameterForm, {
  getParameterFromForm,
  ParameterForm,
  useParameterFormContext
} from 'in-automation/ActionCatalog/useParameterForm';
import DynamicTagBasedPayloadConfigurator from 'in-automation/components/DynamicTagBasedPayloadConfigurator';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { ActionForm, MappedParameter } from 'in-automation/ActionCatalog/useActionForm/types';
import ParameterFormContext from 'in-automation/ActionCatalog/ParameterFormContext';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { ACTION_TYPE } from 'in-automation/constants';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Action.mless';

export interface ParameterDialogProps {
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
  id?: string;
  isNotEditable: boolean;
  ticketIdParameterExist: boolean;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  onRequestToClose: () => void;
  isAnsibleParameter: boolean;
}

export default function ParameterDialog({
  form,
  setForm,
  id,
  isNotEditable,
  ticketIdParameterExist,
  openDialog,
  setOpenDialog,
  onRequestToClose,
  isAnsibleParameter
}: ParameterDialogProps) {
  const actionType = form.get('type').value;
  const parameters = form.get('parameters').value;

  const parameter = parameters.find(parameter => parameter.id === id);

  const [parameterForm, setParameterForm] = useParameterForm({ parameters, id });

  const isAnsible = actionType === ACTION_TYPE.ANSIBLE;
  const type = parameterForm.get('type');
  const parameterName = parameterForm.get('name');
  const disableTicketIdParameter = ticketIdParameterExist && parameterName.value === 'id';
  // IMPORTANT: Ansible actions are a special case where we want to allow the parameters to be editable EXCEPT for the name so we override isNotEditable so that everything is editable except for the name where we will disable the input using isAnsible flag
  const parmeterIsNotEditable =
    (isNotEditable && !isAnsible) || !role?.canConfigureAutomationActions || isAnsibleParameter;
  let actions = [{}];
  if (!parmeterIsNotEditable && role?.canConfigureAutomationActions) {
    actions = [
      {
        kind: 'primary',
        label: t('in-automation:actionHistory.saveButton'),
        onClick: () => {
          doSubmit({ parameterForm, setParameterForm, parameter, form, setForm, id, setOpenDialog });
        }
      },
      {
        label: t('in-automation:cancel'),
        onClick: () => {
          if (setOpenDialog) {
            setOpenDialog(false);
          }
        },
        kind: 'secondary'
      }
    ];
  } else {
    actions = [
      {
        label: t('in-automation:close'),
        onClick: () => {
          if (setOpenDialog) {
            setOpenDialog(false);
          }
        },
        kind: 'primary'
      }
    ];
  }

  let sidePanelTitle = id
    ? t('in-automation:ActionCatalog.editParameter')
    : t('in-automation:ActionCatalog.addParameter');
  if (parmeterIsNotEditable) sidePanelTitle = t('in-automation:ActionCatalog.viewParameter');
  return (
    <SidePanel
      open={openDialog}
      includeOverlay
      actions={actions}
      size="md"
      onRequestClose={onRequestToClose}
      title={sidePanelTitle}
    >
      <div className={locals.parameterDialog}>
        <ParameterFormContext.Provider
          value={{
            form: parameterForm,
            setForm: setParameterForm,
            rootPath: []
          }}
        >
          <MetaDataSection
            isNotEditable={parmeterIsNotEditable}
            isAnsible={actionType === ACTION_TYPE.ANSIBLE}
            disableTicketIdParameter={disableTicketIdParameter}
          />
          {type.value === 'static' && <StaticSection isNotEditable={parmeterIsNotEditable} />}
          {type.value === 'vault' && <VaultSection isNotEditable={parmeterIsNotEditable} />}
          {type.value === 'dynamic' && <DynamicSection isNotEditable={parmeterIsNotEditable} />}
          {type.value !== 'dynamic' && <HiddenSection isNotEditable={parmeterIsNotEditable} />}
        </ParameterFormContext.Provider>
      </div>
    </SidePanel>
  );
}

interface SectionProps {
  isNotEditable: boolean;
}

function MetaDataSection({
  isNotEditable,
  isAnsible,
  disableTicketIdParameter
}: SectionProps & { isAnsible: boolean; disableTicketIdParameter: boolean }) {
  const { form, setForm } = useParameterFormContext();

  const name = form.get('name');
  const label = form.get('label');
  const description = form.get('description');
  const type = form.get('type');
  const required = form.get('required');
  const hidden = form.get('hidden');

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
          onChange={e =>
            setForm(form => form.updateIn(['label'], item => item.setValue(e.target.value).setTouched(true)))
          }
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
          onChange={e =>
            setForm(form => form.updateIn(['name'], item => item.setValue(e.target.value).setTouched(true)))
          }
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
            setForm(form => form.updateIn(['description'], item => item.setValue(e.target.value).setTouched(true)))
          }
          hasError={!description.valid && description.touched}
          maxLength={256}
        />
        <TouchedMessages field={description} className={locals.subErrorTextFormField} />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="parameter-type">{t('in-automation:ActionCatalog.valueType')}</Label>
        <Row>
          <Col md={2} xs={3}>
            <RadioButton
              checked={type.value === 'static'}
              disabled={isNotEditable}
              label={t('in-automation:static')}
              onChange={() =>
                setForm(form => form.updateIn(['type'], item => item.setValue('static').setTouched(true)))
              }
            />
          </Col>
          <Col md={2} xs={3}>
            <RadioButton
              checked={type.value === 'vault'}
              disabled={isNotEditable}
              label={t('in-automation:vault')}
              onChange={() => setForm(form => form.updateIn(['type'], item => item.setValue('vault').setTouched(true)))}
            />
          </Col>
          <Col md={2} xs={3}>
            <RadioButton
              checked={type.value === 'dynamic'}
              disabled={isNotEditable}
              label={t('in-automation:dynamic')}
              onChange={() =>
                setForm(form =>
                  form
                    .updateIn(['type'], item => item.setValue('dynamic').setTouched(true))
                    .updateIn(['hidden'], item => item.setValue(false).setTouched(true))
                )
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
            setForm(form => form.updateIn(['required'], item => item.setValue(e.target.checked).setTouched(true)))
          }
        />
      </FormGroup>
    </>
  );
}

function HiddenSection({ isNotEditable }: SectionProps) {
  const { form, setForm } = useParameterFormContext();

  const hidden = form.get('hidden');

  return (
    <FormGroup>
      <Checkbox
        checked={hidden.value}
        disabled={isNotEditable}
        label={t('in-automation:ActionCatalog.hiddenParam')}
        onChange={e => {
          setForm(form => {
            let updatedForm = form.updateIn(['hidden'], item => item.setValue(e.target.checked).setTouched(true));
            if (e.target.checked) {
              updatedForm = updatedForm.updateIn(['required'], item => item.setValue(true).setTouched(true));
            }
            return updatedForm;
          });
        }}
      />
    </FormGroup>
  );
}

function StaticSection({ isNotEditable }: SectionProps) {
  const { form, setForm } = useParameterFormContext();

  const hidden = form.get('hidden');
  const value = form.get('static');

  return (
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
        onChange={e =>
          setForm(form => form.updateIn(['static'], item => item.setValue(e.target.value).setTouched(true)))
        }
        hasError={!value.valid && value.touched}
        maxLength={256}
      />
      <TouchedMessages field={value} className={locals.subErrorTextFormField} />
    </FormGroup>
  );
}

function VaultSection({ isNotEditable }: SectionProps) {
  const { form, setForm } = useParameterFormContext();

  const hidden = form.get('hidden');
  const vault = form.get('vault');
  const secretPath = vault.get('secretPath');
  const secretKey = vault.get('secretKey');

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
            setForm(form =>
              form.updateIn(['vault', 'secretPath'], item => item.setValue(e.target.value).setTouched(true))
            )
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
            setForm(form =>
              form.updateIn(['vault', 'secretKey'], item => item.setValue(e.target.value).setTouched(true))
            )
          }
          hasError={!secretKey.valid && secretKey.touched}
          maxLength={256}
        />
        <TouchedMessages field={secretKey} className={locals.subErrorTextFormField} />
      </FormGroup>
    </>
  );
}

function DynamicSection({ isNotEditable }: SectionProps) {
  const { form, setForm } = useParameterFormContext();

  const value = form.get('dynamic');
  return (
    <FormGroup>
      <Label htmlFor="parameter-secretPath" hasError={!value.valid && value.touched}>
        {t('in-automation:value')}
      </Label>
      <div>
        <DynamicTagBasedPayloadConfigurator
          value={toViewModel(value.value)}
          disabled={isNotEditable}
          onChange={(viewModel: ViewModel) =>
            setForm(form => form.updateIn(['dynamic'], item => item.setValue(toFormModel(viewModel)).setTouched(true)))
          }
          tagFilterExpression={EMPTY_EXPRESSION}
        />
      </div>
      <TouchedMessages field={value} className={locals.subErrorTextFormField} />
    </FormGroup>
  );
}
function doSubmit({
  parameterForm,
  setParameterForm,
  parameter,
  form,
  setForm,
  id,
  setOpenDialog
}: {
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
  id?: string;
  parameterForm: ParameterForm;
  setParameterForm: React.Dispatch<React.SetStateAction<ParameterForm>>;
  parameter?: MappedParameter;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!parameterForm.hierarchyValid) {
    setParameterForm(parameterForm.setTouched(true, { recurse: true }));
    return;
  }
  const parameterToSubmit = getParameterFromForm(parameterForm);
  const parameters = form.get('parameters').value;

  const updatedParameters = parameter
    ? parameters.map(p => (p.id === id ? { id: id, value: parameterToSubmit } : p))
    : [...parameters, { id: generateUniqueShortId(), value: parameterToSubmit }];
  setForm(form => form.updateIn(['parameters'], item => item.setValue(updatedParameters).setTouched(true)));
  setOpenDialog(false);
}
