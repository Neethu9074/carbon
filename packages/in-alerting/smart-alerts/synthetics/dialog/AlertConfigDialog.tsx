/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm, Field } from 'formalistic';
import React, { useState } from 'react';

import { createLogger } from '@instana/logger';

import {
  EnrichedError,
  enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError
} from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { SyntheticAlertRuleUnion, SyntheticTimeThresholdUnion, SyntheticAlertConfig, VersionedConfig } from 'in-types';
import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition, { fieldNames } from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { SyntheticAlertConfigWithID } from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';

const logger = createLogger('in-alerting/smart-alert/synthetics/AlertDialog');

interface AlertConfigDialogType {
  onClose: (config?: SyntheticAlertConfigWithID) => void;
  alertConfig: SyntheticAlertConfig & VersionedConfig;
  editMode: boolean;
  startWithSimpleMode: boolean;
}

export default function AlertConfigDialog({
  onClose,
  alertConfig,
  editMode,
  startWithSimpleMode
}: AlertConfigDialogType) {
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig));

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);
  return (
    <AlertConfigDialogWithThreshold
      updateForm={(updateForm: MapForm) => {
        setForm(updateForm);
      }}
      form={form}
      onChange={createOnChange(setForm, form)}
      onCreate={() => {
        createOrSaveAlert(form, setForm, onClose, editMode, setIsSaving, setMessages);
      }}
      onClose={() => {
        // canceled and dialog closed
        onClose();
      }}
      editMode={editMode}
      startWithSimpleMode={startWithSimpleMode}
      isSaving={isSaving}
      messages={messages}
    />
  );
}

function createOnChange(setForm: (form: MapForm) => void, externalForm: MapForm) {
  return function onChange(path: string[], updater: (item: Item) => Item): void {
    setForm(externalForm.updateIn(path, updater));
  };
}

function createOrSaveAlert(
  form: MapForm,
  setForm: (form: MapForm) => void,
  onClose: (config?: SyntheticAlertConfig & { readonly id?: string }) => void,
  editMode: boolean,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>
) {
  setIsSaving(true);

  // remove existing error messages:
  setMessages(prevMessages => prevMessages.filter(m => m.level && m.level !== 'error'));

  const addMessage = (message: EnrichedError) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }

  const alertConfig = toAlertConfig(form);

  if (editMode) {
    updateAlertConfig(alertConfig, (form.get('id') as Field<string>).value).once(
      alertConfig => {
        onClose(alertConfig);
        showSuccessMessage(alertConfig.name, editMode);
      },
      error => {
        logger.error(`failed to update alertConfig: ${alertConfig} ${error.message}`, error);
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  } else {
    createAlertConfig(alertConfig).once(
      alertConfig => {
        onClose(alertConfig);
        //To do : we will add link to detail page once it is in place.
        //const href$ = getLinkToAlertConfig(alertConfig.id, null);
        //showSuccessMessage(alertConfig.name, editMode, false, href$);
        showSuccessMessage(alertConfig.name, editMode);
      },
      error => {
        logger.error(`failed to save alertConfig: ${alertConfig} ${error.message}`, error);
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  }
}

function toAlertConfig(form: MapForm): Readonly<SyntheticAlertConfig> {
  const tagFilterFormModel = (form.get(fieldNames.tagFilterExpression) as Field<[]>).value;

  return Object.freeze({
    rule: (form.get('rule') as Field<SyntheticAlertRuleUnion>).toJS(),
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel, false),
    alertChannelIds: (form.get(fieldNames.alertChannelIds) as Field<string[]>).value,
    severity: (form.get(fieldNames.severity) as Field<number>).value,
    description: (form.get(fieldNames.description) as Field<string>).value,
    name: (form.get(fieldNames.name) as Field<string>).value,
    syntheticTestIds: (form.get(fieldNames.syntheticTestIds) as Field<string[]>).value,
    timeThreshold: (form.get('timeThreshold') as Field<SyntheticTimeThresholdUnion>).toJS()
  });
}
