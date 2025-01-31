/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Message } from '@instana/components';

import { ModalNotificationProps } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/types';
import { t } from 'in-i18n';

const localisationStrings = {
  successMessage: t('in-settings:tabs.deleteLogs.toastSuccessMessage'),
  errorMessage: t('in-settings:tabs.deleteLogs.deletionError'),
  warningMessage: t('in-settings:tabs.deleteLogs.deletionWarning'),
  success: t('in-settings:tabs.deleteLogs.success'),
  error: t('in-settings:tabs.deleteLogs.failure'),
  warning: t('in-settings:tabs.deleteLogs.warning')
};

const icon = {
  success: 'lib_uncheck',
  warning: 'lib_help_error_warning_outline',
  error: 'lib_help_error_error_circle'
};

export const ModalNotification = ({ variant = 'success' }: ModalNotificationProps) => {
  return (
    <Message
      type={variant}
      title={localisationStrings[variant]}
      description={localisationStrings[`${variant}Message`]}
      iconType={icon[variant]}
      withIcon
      dismissible
      fullInlineWidth
      inline
    />
  );
};
