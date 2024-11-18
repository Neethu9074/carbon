/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export const REMAINING = 'remaining';
export const REMOVING = 'removing';
export const CRITICAL = 'CRITICAL';
export const WARNING = 'WARNING';

function getFilteredChannels(enabledList, thresholdType, filteredChannelList, condition = REMAINING) {
  const filteredIds = new Set(filteredChannelList.map(item => item.id));
  const items = enabledList?.[thresholdType];

  return items?.filter(itemId => (condition == REMOVING ? filteredIds.has(itemId) : !filteredIds.has(itemId))) || [];
}
export function getAlertChannelTitle() {
  return t('in-settings:tabs.alertChannels');
}

export function getAlertChannelColumnTitle(
  thresholdType,
  warningThresholdFieldDisabled,
  criticalThresholdFieldDisabled,
  selectedChannels
) {
  if (!warningThresholdFieldDisabled && criticalThresholdFieldDisabled) {
    return selectedChannels?.WARNING?.length > 0 ? t('in-alerting:smartAlerts.alertChannelList.alertLevel') : '';
  }

  if (warningThresholdFieldDisabled && !criticalThresholdFieldDisabled) {
    return selectedChannels?.CRITICAL?.length > 0 ? t('in-alerting:smartAlerts.alertChannelList.alertLevel') : '';
  }

  if (!warningThresholdFieldDisabled && !criticalThresholdFieldDisabled) {
    return thresholdType == WARNING
      ? t('in-alerting:smartAlerts.alertChannelList.warning')
      : t('in-alerting:smartAlerts.alertChannelList.critical');
  }
}

export function updateAllToggleAndFormForWarning(enabledChannels, entitiesBeforePagination, onChange) {
  return value => {
    const { WARNING: currentWarningSelections = [], CRITICAL: currentCriticalSelections = [] } = enabledChannels;
    let updatedWarningSelections;
    let updatedCriticalSelections = currentCriticalSelections;

    if (value) {
      // Add all entity IDs from entitiesBeforePagination to WARNING selections
      const allWarningIds = entitiesBeforePagination.map(item => item.id);
      updatedWarningSelections = [...new Set([...currentWarningSelections, ...allWarningIds])];
    } else {
      // Filter out entities from WARNING and get the remaining WARNING channels
      updatedWarningSelections = getFilteredChannels(enabledChannels, WARNING, entitiesBeforePagination, REMAINING);

      // Update CRITICAL selections by adding entities that were removed from WARNING
      updatedCriticalSelections = [
        ...new Set([
          ...currentCriticalSelections,
          ...getFilteredChannels(enabledChannels, WARNING, entitiesBeforePagination, REMOVING)
        ])
      ];
    }

    updateAlertChannelFormField(onChange, updatedWarningSelections, updatedCriticalSelections);
  };
}

export function updateAllToggleAndFormForCritical(enabledChannels, entitiesBeforePagination, onChange) {
  return value => {
    const { WARNING: currentWarningSelections = [], CRITICAL: currentCriticalSelections = [] } = enabledChannels;
    let updatedWarningSelections = currentWarningSelections;
    let updatedCriticalSelections;

    if (value) {
      // If toggled on, add all entity IDs from entitiesBeforePagination to CRITICAL selections
      const allCriticalIds = entitiesBeforePagination.map(item => item.id);
      updatedCriticalSelections = [...new Set([...currentCriticalSelections, ...allCriticalIds])];
    } else {
      // If toggled off, get remaining CRITICAL channels after filtering out current entities
      updatedCriticalSelections = getFilteredChannels(enabledChannels, CRITICAL, entitiesBeforePagination, REMAINING);

      // Update WARNING selections by adding entities that were removed from CRITICAL
      updatedWarningSelections = [
        ...new Set([
          ...currentWarningSelections,
          ...getFilteredChannels(enabledChannels, CRITICAL, entitiesBeforePagination, REMOVING)
        ])
      ];
    }

    updateAlertChannelFormField(onChange, updatedWarningSelections, updatedCriticalSelections);
  };
}

export function updateOnRowToggleAndFormForWarning(selectedChannels, entity, onChange) {
  return value => {
    const { WARNING: currentWarningSelections = [], CRITICAL: currentCriticalSelections = [] } = selectedChannels;
    let updatedWarningSelections = currentWarningSelections;
    let updatedCriticalSelections = currentCriticalSelections;

    if (value) {
      // Add entity.id to WARNING selections
      updatedWarningSelections = [...currentWarningSelections, entity.id];
    } else {
      // Remove entity.id from WARNING selections
      updatedWarningSelections = currentWarningSelections.filter(channelId => channelId !== entity.id);
      // Ensure entity.id is in CRITICAL selections
      if (!currentCriticalSelections.includes(entity.id)) {
        updatedCriticalSelections = [...currentCriticalSelections, entity.id];
      }
    }

    updateAlertChannelFormField(onChange, updatedWarningSelections, updatedCriticalSelections);
  };
}

export function updateOnRowToggleAndFormForCritical(selectedChannels, entity, onChange) {
  return value => {
    const { WARNING: currentWarningSelections = [], CRITICAL: currentCriticalSelections = [] } = selectedChannels;
    let updatedWarningSelections = currentWarningSelections;
    let updatedCriticalSelections = currentCriticalSelections;

    if (value) {
      // Add entity.id to CRITICAL selections if not already present
      updatedCriticalSelections = [...currentCriticalSelections, entity.id];
    } else {
      // Remove entity.id from CRITICAL selections
      updatedCriticalSelections = currentCriticalSelections.filter(channelId => channelId !== entity.id);
      // Ensure entity.id is in WARNING selections
      if (!currentWarningSelections.includes(entity.id)) {
        updatedWarningSelections = [...currentWarningSelections, entity.id];
      }
    }

    updateAlertChannelFormField(onChange, updatedWarningSelections, updatedCriticalSelections);
  };
}

function updateAlertChannelFormField(onChange, newWarningSelections = [], newCriticalSelections = []) {
  onChange(['alertChannels'], field =>
    field
      .setValue({
        WARNING: newWarningSelections,
        CRITICAL: newCriticalSelections
      })
      .setTouched(true)
  );
}

export function updateDefaultSelectionsToForm(
  form,
  updateForm,
  selectedChannels,
  warningThresholdFieldDisabled,
  criticalThresholdFieldDisabled,
  selectedList,
  currentAlertChannelIds
) {
  let newWarningSelections = [...(selectedChannels.WARNING ?? [])];
  let newCriticalSelections = [...(selectedChannels.CRITICAL ?? [])];

  if (!warningThresholdFieldDisabled) {
    newWarningSelections = [...newWarningSelections, ...selectedList];
  } else if (!criticalThresholdFieldDisabled) {
    newCriticalSelections = [...newCriticalSelections, ...selectedList];
  }

  updateChannelListsToForm(
    form,
    updateForm,
    [...new Set([...currentAlertChannelIds, ...selectedList])],
    newWarningSelections,
    newCriticalSelections
  );
}

export function updateChannelListsToForm(form, updateForm, selectedList, newWarningSelections, newCriticalSelections) {
  updateForm(
    form
      .updateIn(['hiddenFields', 'selectedChannelList'], f => f.setValue(selectedList).setTouched(true))
      .updateIn(['alertChannels'], f =>
        f
          .setValue({
            WARNING: newWarningSelections,
            CRITICAL: newCriticalSelections
          })
          .setTouched(true)
      )
  );
}

export function updateAlertChannelIds(form, updateForm, newWarningSelections = [], newCriticalSelections = []) {
  updateForm(
    form.updateIn(['alertChannels'], f =>
      f
        .setValue({
          WARNING: newWarningSelections,
          CRITICAL: newCriticalSelections
        })
        .setTouched(true)
    )
  );
}
