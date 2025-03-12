/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';

import {
  EnrichedError,
  enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError
} from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import {
  updateAlertConfig,
  createAlertConfig
} from 'in-alerting/smart-alerts/infrastructure/api/infrastructureAlertConfig';
import { InfraSmartAlertConfig } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';
import { ADVANCED, FULLSCREEN, SIMPLE } from 'in-alerting/smart-alerts/data/constants';
import { ALERTING_SAVED, ALERTING_UPDATED } from 'in-services/tracking/eventNames';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { InfraAlertConfig } from 'in-types';

interface createOrSaveAlertProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  getLinkToAlertConfig: (alertConfigId: string, alertConfigVersion?: number) => string;
  onClose: (config?: InfraSmartAlertConfig) => void;
  editMode: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>;
  toAlertConfig: (
    form: MapForm<any>,
    placeHolderText: { alertTitle: string; alertDescription: { WARNING?: string; CRITICAL?: string } }
  ) => Readonly<InfraAlertConfig>;
  isSimpleMode: boolean;
  trackCta: CtaTrackingFunction;
  duplicateFrom?: string;
  placeHolderText: { alertTitle: string; alertDescription: { WARNING?: string; CRITICAL?: string } };
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
  trackCta,
  duplicateFrom,
  placeHolderText
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

  const alertConfig: InfraAlertConfig = toAlertConfig(form, placeHolderText);

  if (editMode) {
    const updateConfig = updateAlertConfig(alertConfig, form.get('id').value);
    updateConfig.once(
      updatedAlertConfig => {
        onClose(updatedAlertConfig);
        showSuccessMessage(updatedAlertConfig.name, editMode);
        trackCta(ALERTING_UPDATED, { ...updatedAlertConfig, dialogMode: isSimpleMode ? SIMPLE : ADVANCED });
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
        trackCta(ALERTING_SAVED, {
          ...newConfig,
          dialogMode: ADVANCED
        });
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
  navigateToAlertConfig: (alertConfigId: string, alertConfigVersion?: number) => string;
  editMode: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>;
  toAlertConfig: (
    form: MapForm<any>,
    placeHolderText: { alertTitle: string; alertDescription: { WARNING?: string; CRITICAL?: string } }
  ) => Readonly<InfraAlertConfig>;
  trackCta: CtaTrackingFunction;
  duplicateFrom?: string;
  placeHolderText: { alertTitle: string; alertDescription: { WARNING?: string; CRITICAL?: string } };
}

export function createOrSaveAlertFromTearSheet({
  form,
  setForm,
  navigateToAlertConfig,
  editMode,
  setIsSaving,
  setMessages,
  toAlertConfig,
  trackCta,
  duplicateFrom,
  placeHolderText
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

  const alertConfig: InfraAlertConfig = toAlertConfig(form, placeHolderText);

  if (editMode) {
    const updateConfig = updateAlertConfig(alertConfig, form.get('id').value);
    updateConfig.once(
      updatedAlertConfig => {
        trackCta(ALERTING_UPDATED, { ...updatedAlertConfig, dialogMode: FULLSCREEN });
        navigateToAlertConfig(updatedAlertConfig?.id ?? form.get('id').value, updatedAlertConfig?.created);
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
        trackCta(ALERTING_SAVED, {
          ...newConfig,
          dialogMode: FULLSCREEN
        });
        navigateToAlertConfig(createAlertConfig.id, createAlertConfig?.created);
      },
      error => {
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  }
}
