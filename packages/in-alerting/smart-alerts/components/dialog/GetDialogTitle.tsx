/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Stack } from '@instana/components';

import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import { Title } from 'in-components/Dialog/Header';
import { t } from 'in-i18n';

export function getDialogTitle({
  isGlobalSmartAlert,
  editMode,
  migrationMode,
  builtIn
}: {
  editMode?: boolean;
  migrationMode?: boolean;
  isGlobalSmartAlert?: boolean;
  builtIn: boolean;
}) {
  const mode = isGlobalSmartAlert ? 'Global' : 'Local';
  let title = t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleCreateNewAlert', {
    context: mode
  });
  if (migrationMode) {
    title = t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleMigrateAlert', {
      context: mode
    });
  } else if (editMode) {
    title = t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleEditAlert', {
      context: mode
    });
  }
  return (
    <Stack direction="horizontal" align="center">
      <Title title={title} />
      <BuiltInIndicator builtIn={builtIn} />
    </Stack>
  );
}
