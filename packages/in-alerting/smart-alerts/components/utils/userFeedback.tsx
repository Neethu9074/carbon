/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t, Trans } from 'in-i18n';

export function showSuccessMessage(name: string, editMode = false, isGlobalSmartAlert = false) {
  const mode = isGlobalSmartAlert ? 'Global' : 'Local';

  addMessage({
    type: 'info',
    timeout: 4000,
    title: t(
      editMode
        ? 'in-alerting:smartAlerts.components.userInfo.success.edit.alert.title'
        : 'in-alerting:smartAlerts.components.userInfo.success.create.alert.title',
      { context: mode }
    ),
    content: (
      <Trans
        i18nKey={
          editMode
            ? 'in-alerting:smartAlerts.components.userInfo.success.edit.alert.message'
            : 'in-alerting:smartAlerts.components.userInfo.success.create.alert.message'
        }
        values={{
          context: mode,
          name
        }}
      />
    )
  });
}
