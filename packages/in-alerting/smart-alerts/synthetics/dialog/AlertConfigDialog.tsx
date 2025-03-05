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
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/synthetics/form/formUtils';
import { useGetAlertConfigLink, useLinkToGlobalAlertConfigWithoutDashboard } from 'in-synthetics/navigation/paths';
import { SyntheticAlertConfigWithID } from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { useSegmentTracking, CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';
import { ALERTING_SAVED, ALERTING_UPDATED } from 'in-services/tracking/eventNames';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t } from 'in-i18n';

const logger = createLogger('in-alerting/smart-alert/synthetics/AlertDialog');
export interface DuplicateFrom {
  duplicateFrom?: string;
}
interface AlertConfigDialogType {
  onClose: (config?: SyntheticAlertConfigWithID) => void;
  alertConfig: SyntheticAlertConfig & VersionedConfig & DuplicateFrom;
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
  const [toInitialStep, setToInitialStep] = useState(false);
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig));

  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<EnrichedError[]>([]);

  const { trackCta } = useSegmentTracking();

  const getLinkToAlertConfig = useGetAlertConfigLink();
  const getLinkToGlobalAlertConfig = useLinkToGlobalAlertConfigWithoutDashboard();
  const duplicateFrom = alertConfig?.duplicateFrom;
  return (
    <AlertConfigDialogWithThreshold
      updateForm={(updateForm: MapForm<any>) => {
        setForm(updateForm);
      }}
      form={form}
      onChange={createOnChange(setForm, form)}
      onCreate={simpleMode => {
        if (form.get(fieldNames.syntheticTestIds).value.length === 0) {
          addActiveDialog(
            <ConfirmationDialog
              header={t('in-alerting:components.alertActionConfirmationDialogHeader')}
              description={t('in-alerting:components.alertConfirmationDialogDescription', {
                entityPlaceholder: t('in-alerting:smartAlerts.synthetics.advanced.alertTestsLabel')
              })}
              confirmButtonLabel={t('in-alerting:components.labelConfirm')}
              confirmButtonKind="danger"
              onClose={() => {
                navigateToStep1(simpleMode, setToInitialStep);
                close();
              }}
              onSubmit={() => {
                close();
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
                  simpleMode,
                  trackCta,
                  duplicateFrom
                );
              }}
            />
          );
          return;
        }
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
          simpleMode,
          trackCta,
          duplicateFrom
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
      setToInitialStep={setToInitialStep}
      toInitialStep={toInitialStep}
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
  simpleMode: boolean,
  trackCta: CtaTrackingFunction,
  duplicateFrom?: string
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
        trackCta(ALERTING_UPDATED, { ...alertConfig });
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
        const newConfig = duplicateFrom ? { ...alertConfig, cloneFromId: duplicateFrom } : alertConfig;
        trackCta(ALERTING_SAVED, { ...newConfig, dialogMode: simpleMode ? 'Simple' : 'Advanced' });
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
    description: (form.get(fieldNames.description) as Field<string>).value || getDescriptionPlaceholder(form),
    name: (form.get(fieldNames.name) as Field<string>).value || getTitlePlaceholder(),
    syntheticTestIds: (form.get(fieldNames.syntheticTestIds) as Field<string[]>).value,
    gracePeriod: form.get(fieldNames.gracePeriod).value,
    timeThreshold: (form.get('timeThreshold') as Field<SyntheticTimeThresholdUnion>).toJS(),
    customPayloadFields: form.get('customPayloadFields').toJS()
  });
}

function navigateToStep1(simpleMode: boolean, setToInitialStep: React.Dispatch<React.SetStateAction<boolean>>) {
  if (simpleMode) {
    setToInitialStep(true);
  }
}
