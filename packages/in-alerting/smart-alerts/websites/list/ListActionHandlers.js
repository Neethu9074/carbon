/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// import {
//   TearSheetEditActionHandler,
//   TearSheetCloneActionHandler
// } from 'in-alerting/smart-alerts/eum/components/TearSheet/TearSheetActionHandlers';
import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/websites/details/AlertDetails';
import { websitesSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

function handleClone(config) {
  openSmartAlertDialog(config, true);
}

function handleEdit(config) {
  openSmartAlertDialog(config);
}

// function HandleEditNew(config) {
//   return (
//     <TearSheetEditActionHandler
//       id={config.id}
//       created={config.created}
//       eumId={config.websiteId}
//       eumType={eumType}
//       alertConfig={config}
//     />
//   );
// }

// function HandleCloneNew(config) {
//   return (
//     <TearSheetCloneActionHandler
//       id={config.id}
//       created={config.created}
//       eumId={config.websiteId}
//       eumType={eumType}
//       alertConfig={config}
//     />
//   );
// }

function openSmartAlertDialog(config, isCopy = false) {
  addActiveDialog(
    <SmartAlertConfigDialogWrapper
      applicationLabel={config.name}
      alertConfig={isCopy ? duplicateAlertConfig(config) : config}
      onClose={() => {
        close();
        refreshSmartAlertConfigsList();
      }}
      editMode={!isCopy}
    />
  );
}

export const actionHandlers = {
  ...(!websitesSmartAlertFullScreenDesignEnabled && { handleClone: config => handleClone(config) }),
  // ...(websitesSmartAlertFullScreenDesignEnabled && { handleCloneNew: config => HandleCloneNew(config) }),
  ...(websitesSmartAlertFullScreenDesignEnabled && {
    handleEditSelector: config => handleEdit(config)
  }),
  handleDelete: (id, setIsSaving, configName, trackCta) =>
    handleDelete(id, setIsSaving, configName, baseUrl.WEBSITE, trackCta),
  ...(!websitesSmartAlertFullScreenDesignEnabled && { handleEdit: config => handleEdit(config) }),
  // ...(websitesSmartAlertFullScreenDesignEnabled && { handleEditNew: config => HandleEditNew(config) }),
  ...(websitesSmartAlertFullScreenDesignEnabled && {
    handleCloneSelector: config => handleClone(config)
  }),
  handleToggleEnabled: (enabled, id, setIsSaving) => handleToggleEnabled(enabled, id, setIsSaving, baseUrl.WEBSITE)
};
