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
  MobileAppSmartAlertConfigWithMetadata,
  MobileAppSmartAlertConfig,
  WebsiteSmartAlertConfig,
  WebsiteSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import {
  updateAlertConfig as mobileUpdateAlertConfig,
  createAlertConfig as mobileCreateAlertConfig
} from 'in-alerting/smart-alerts/mobileApp/api/mobileAppAlertConfig';
import {
  updateAlertConfig as websiteUpdateAlertConfig,
  createAlertConfig as webisteCreateAlertConfig
} from 'in-alerting/smart-alerts/websites/api/websiteAlertConfig';
import { showSuccessMessage } from 'in-alerting/smart-alerts/components/utils/userFeedback';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import { ALERTING_SAVED, ALERTING_UPDATED } from 'in-services/tracking/eventNames';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { MobileAppAlertConfig, WebsiteAlertConfig } from 'in-types';

interface createOrSaveAlertProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  getLinkToAlertConfig: (alertConfigId: string, id: string, alertConfigVersion?: number) => string;
  onClose: (config?: MobileAppSmartAlertConfig | (WebsiteSmartAlertConfig & { readonly id?: string })) => void;
  editMode: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>;
  toAlertConfig: (form: MapForm<any>) => Readonly<MobileAppAlertConfig | WebsiteAlertConfig>;
  isSimpleMode: boolean;
  eumType: string;
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
  eumType,
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

  const alertConfig: MobileAppAlertConfig | WebsiteAlertConfig = toAlertConfig(form);

  if (editMode) {
    const updateConfig =
      eumType === websiteEum
        ? websiteUpdateAlertConfig(alertConfig as WebsiteSmartAlertConfig, form.get('id').value)
        : mobileUpdateAlertConfig(alertConfig as MobileAppSmartAlertConfig, form.get('id').value);
    updateConfig.once(
      updatedAlertConfig => {
        onClose(updatedAlertConfig);
        showSuccessMessage(updatedAlertConfig.name, editMode);
        trackCta?.(ALERTING_UPDATED, { ...updatedAlertConfig, dialogMode: 'Advanced' });
      },
      error => {
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  } else {
    const createConfig =
      eumType === websiteEum
        ? webisteCreateAlertConfig(alertConfig as WebsiteSmartAlertConfig)
        : mobileCreateAlertConfig(alertConfig as MobileAppSmartAlertConfig);
    createConfig.once(
      createAlertConfig => {
        onClose(createAlertConfig);
        const href =
          eumType === websiteEum
            ? getLinkToAlertConfig(
                createAlertConfig.id,
                (createAlertConfig as WebsiteSmartAlertConfigWithMetadata).websiteId
              )
            : getLinkToAlertConfig(
                createAlertConfig.id,
                (createAlertConfig as MobileAppSmartAlertConfigWithMetadata).mobileAppId
              );
        showSuccessMessage(createAlertConfig.name, editMode, false, href);
        const newConfig = duplicateFrom ? { ...createAlertConfig, cloneFromId: duplicateFrom } : createAlertConfig;
        trackCta?.(ALERTING_SAVED, { ...newConfig, dialogMode: isSimpleMode ? 'Simple' : 'Advanced' });
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
  navigateToAlertConfig: (alertConfigId: string, websiteId: string, alertConfigVersion?: number) => void;
  editMode: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<EnrichedError[]>>;
  toAlertConfig: (form: MapForm<any>) => Readonly<MobileAppAlertConfig | WebsiteAlertConfig>;
  isSimpleMode: boolean;
  eumType: string;
  duplicateFrom?: string;
  trackCta: CtaTrackingFunction;
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
  eumType,
  duplicateFrom,
  trackCta
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

  const alertConfig: MobileAppAlertConfig | WebsiteAlertConfig = toAlertConfig(form);
  const eumId =
    eumType === websiteEum
      ? (alertConfig as WebsiteAlertConfig).websiteId
      : (alertConfig as MobileAppAlertConfig).mobileAppId;

  if (editMode) {
    const updateConfig =
      eumType === websiteEum
        ? websiteUpdateAlertConfig(alertConfig as WebsiteSmartAlertConfigWithMetadata, form.get('id').value)
        : mobileUpdateAlertConfig(alertConfig as MobileAppSmartAlertConfigWithMetadata, form.get('id').value);
    updateConfig.once(
      updatedAlertConfig => {
        trackCta?.(ALERTING_UPDATED, { ...updatedAlertConfig, dialogMode: 'Advanced' });
        navigateToAlertConfig(form.get('id').value, eumId, updatedAlertConfig?.created);
      },
      error => {
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  } else {
    const createConfig =
      eumType === websiteEum
        ? webisteCreateAlertConfig(alertConfig as WebsiteSmartAlertConfig)
        : mobileCreateAlertConfig(alertConfig as MobileAppSmartAlertConfig);

    createConfig.once(
      createAlertConfig => {
        const newConfig = duplicateFrom ? { ...createAlertConfig, cloneFromId: duplicateFrom } : createAlertConfig;
        trackCta?.(ALERTING_SAVED, { ...newConfig, dialogMode: isSimpleMode ? 'Simple' : 'Advanced' });
        navigateToAlertConfig(createAlertConfig.id, eumId, createAlertConfig?.created);
      },
      error => {
        addMessage(enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError(error));
        setIsSaving(false);
      }
    );
  }
}
