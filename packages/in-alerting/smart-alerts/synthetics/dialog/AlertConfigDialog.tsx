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
import { useGetAlertConfigLink, useLinkToGlobalAlertConfigWithoutDashboard } from 'in-synthetics/navigation/paths';
import { SyntheticAlertConfigWithID } from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { trackAlertSaved, trackAlertUpdated } from 'in-alerting/smart-alerts/components/tracker';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';

const logger = createLogger('in-alerting/smart-alert/synthetics/AlertDialog');

interface AlertConfigDialogType {
  onClose: (config?: SyntheticAlertConfigWithID) => void;
  alertConfig: SyntheticAlertConfig & VersionedConfig;
  editMode: boolean;
  startWithSimpleMode: boolean;
  testId?: string;
}

export default function AlertConfigDialog({
  onClose,
  alertConfig,
  editMode,
  startWithSimpleMode,
  testId
}: AlertConfigDialogType) {
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig));

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);

  const getLinkToAlertConfig = useGetAlertConfigLink();
  const getLinkToGlobalAlertConfig = useLinkToGlobalAlertConfigWithoutDashboard();
  return (
    <AlertConfigDialogWithThreshold
      updateForm={(updateForm: MapForm<any>) => {
        setForm(updateForm);
      }}
      form={form}
      onChange={createOnChange(setForm, form)}
      onCreate={simpleMode => {
        createOrSaveAlert(
          form,
          setForm,
          onClose,
          editMode,
          setIsSaving,
          setMessages,
          testId,
          getLinkToAlertConfig,
          getLinkToGlobalAlertConfig,
          simpleMode
        );
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

function createOnChange(setForm: (form: MapForm<any>) => void, externalForm: MapForm<any>) {
  return function onChange(path: string[], updater: (item: Item) => Item): void {
    // @ts-expect-error ts cant determine nested fields of MapForm<any>
    setForm(externalForm.updateIn(path, updater));
  };
}

function createOrSaveAlert(
  form: MapForm<any>,
  setForm: (form: MapForm<any>) => void,
  onClose: (config?: SyntheticAlertConfig & { readonly id?: string }) => void,
  editMode: boolean,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>,
  testId: string | undefined,
  getLinkToAlertConfig: (id: string, testId: string, created?: number) => string,
  getLinkToGlobalAlertConfig: (id: string) => string,
  simpleMode: boolean
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
        trackAlertUpdated(alertConfig);
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
        const href = testId
          ? getLinkToAlertConfig(alertConfig?.id, testId, alertConfig?.created)
          : getLinkToGlobalAlertConfig(alertConfig?.id);
        showSuccessMessage(alertConfig.name, editMode, false, href);
        trackAlertSaved(alertConfig, simpleMode);
      },
      error => {
        logger.error(`failed to save alertConfig: ${alertConfig} ${error.message}`, error);
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  }
}

function toAlertConfig(form: MapForm<any>): Readonly<SyntheticAlertConfig> {
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
