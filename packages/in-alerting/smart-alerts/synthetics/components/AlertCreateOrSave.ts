/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';

import { SyntheticAlertConfig } from '@instana/types';

import {
  EnrichedError,
  enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError
} from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { createAlertConfig, updateAlertConfig } from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { ALERTING_SAVED, ALERTING_UPDATED } from 'in-services/tracking/eventNames';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { FULLSCREEN } from 'in-alerting/smart-alerts/data/constants';

interface createOrSaveAlertFromTearSheetProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  navigateToAlertConfig: (alertConfigId: string, alertConfigVersion?: number) => void;
  editMode: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>;
  toAlertConfig: (form: MapForm<any>) => Readonly<SyntheticAlertConfig>;
  trackCta: CtaTrackingFunction;
  syntheticTestId?: string;
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

  const alertConfig: SyntheticAlertConfig = toAlertConfig(form);

  if (editMode) {
    const updateConfig = updateAlertConfig(alertConfig, form.get('id').value);
    updateConfig.once(
      updatedAlertConfig => {
        trackCta(ALERTING_UPDATED, { ...updatedAlertConfig, dialogMode: FULLSCREEN });
        navigateToAlertConfig(form.get('id').value);
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
        trackCta(ALERTING_SAVED, { ...newConfig, dialogMode: FULLSCREEN });
        navigateToAlertConfig(createAlertConfig.id, createAlertConfig?.created);
      },
      error => {
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  }
}
