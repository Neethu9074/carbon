/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

import { LogAlertConfig } from '@instana/types';

import {
  EnrichedError,
  enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError
} from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { updateAlertConfig, createAlertConfig } from 'in-alerting/smart-alerts/logs/api/logsAlertConfig';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';
import { ALERTING_SAVED, ALERTING_UPDATED } from 'in-services/tracking/eventNames';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';

interface createOrSaveAlertProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  getLinkToAlertConfig: (alertConfigId: string, alertConfigVersion?: number) => string;
  onClose: (config?: LogAlertConfig) => void;
  editMode: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>;
  toAlertConfig: (form: MapForm<any>) => Readonly<LogAlertConfig>;
  isSimpleMode: boolean;
  duplicateFrom?: string;
  trackCta: CtaTrackingFunction;
}

export function createOrSaveAlert({
  form,
  setForm,
  getLinkToAlertConfig,
  onClose,
  editMode,
  setIsSaving,
  setMessages,
  toAlertConfig,
  isSimpleMode,
  duplicateFrom,
  trackCta
}: createOrSaveAlertProps) {
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

  const alertConfig: LogAlertConfig = toAlertConfig(form);

  if (editMode) {
    const updateConfig = updateAlertConfig(alertConfig, form.get('id').value);
    updateConfig.once(
      updatedAlertConfig => {
        onClose(updatedAlertConfig);
        showSuccessMessage(updatedAlertConfig.name, editMode);
        trackCta(ALERTING_UPDATED, { ...updatedAlertConfig, dialogMode: 'Advanced' });
      },
      error => {
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  } else {
    const createConfig = createAlertConfig(alertConfig);
    createConfig.once(
      createAlertConfig => {
        onClose(createAlertConfig);
        const href = getLinkToAlertConfig(createAlertConfig.id);
        showSuccessMessage(createAlertConfig.name, editMode, false, href);
        const newConfig = duplicateFrom ? { ...createAlertConfig, cloneFromId: duplicateFrom } : createAlertConfig;
        trackCta(ALERTING_SAVED, { ...newConfig, dialogMode: isSimpleMode ? 'Simple' : 'Advanced' });
      },
      error => {
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  }
}

interface createOrSaveAlertFromTearSheetProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  navigateToAlertConfig: (alertConfigId: string, alertConfigVersion?: number) => void;
  editMode: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>;
  toAlertConfig: (form: MapForm<any>) => Readonly<LogAlertConfig>;
  isSimpleMode: boolean;
  trackCta: CtaTrackingFunction;
  duplicateFrom?: string;
}

export function createOrSaveAlertFromTearSheet({
  form,
  setForm,
  navigateToAlertConfig,
  editMode,
  setIsSaving,
  setMessages,
  toAlertConfig,
  isSimpleMode,
  trackCta,
  duplicateFrom
}: createOrSaveAlertFromTearSheetProps) {
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

  const alertConfig: LogAlertConfig = toAlertConfig(form);

  if (editMode) {
    const updateConfig = updateAlertConfig(alertConfig, form.get('id').value);
    updateConfig.once(
      updatedAlertConfig => {
        trackCta(ALERTING_UPDATED, { ...updatedAlertConfig });
        navigateToAlertConfig(updatedAlertConfig.id, updatedAlertConfig?.created);
      },
      error => {
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  } else {
    const createConfig = createAlertConfig(alertConfig);
    createConfig.once(
      createAlertConfig => {
        const newConfig = duplicateFrom ? { ...createAlertConfig, cloneFromId: duplicateFrom } : createAlertConfig;
        trackCta(ALERTING_SAVED, { ...newConfig, dialogMode: isSimpleMode ? 'Simple' : 'Advanced' });
        navigateToAlertConfig(createAlertConfig.id, createAlertConfig?.created);
      },
      error => {
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  }
}
