/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { getAllActions } from 'in-api/automation';
import { t } from 'in-i18n';

import ActionTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionTable';

export default function ActionCatalog() {
  return (
    <ActionTable
      title={ t('in-settings:tabs.actionCatalog')}
      noDataMessage={t('in-settings:tabs.noActions')}
      pageSize={20}
      loadEntities={getAllActions}
    />
  );
}
