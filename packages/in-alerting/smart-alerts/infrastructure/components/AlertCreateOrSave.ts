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
import { trackAlertSaved, trackAlertUpdated } from 'in-alerting/smart-alerts/components/tracker';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';

interface createOrSaveAlertProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  getLinkToAlertConfig: (alertConfigId: string, alertConfigVersion?: number) => string;
  onClose: (config?: InfraSmartAlertConfig) => void;
  editMode: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>;
  toAlertConfig: (form: MapForm<any>) => Readonly<InfraSmartAlertConfig>;
  isSimpleMode: boolean;
  duplicateFrom?: string;
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
  duplicateFrom
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

  const alertConfig: InfraSmartAlertConfig = toAlertConfig(form);

  if (editMode) {
    const updateConfig = updateAlertConfig(alertConfig, form.get('id').value);
    updateConfig.once(
      updatedAlertConfig => {
        onClose(updatedAlertConfig);
        showSuccessMessage(updatedAlertConfig.name, editMode);
        trackAlertUpdated(updatedAlertConfig);
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
        trackAlertSaved(newConfig, isSimpleMode);
      },
      error => {
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  }
}
