/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { Button } from '@instana/legacy';

import { ModalNotificationProps } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/types';
import { t } from 'in-i18n';

import locals from './ModalNotification.mless';

export const ModalNotification = ({ variant = 'success', onClick = () => {} }: ModalNotificationProps) => {
  const localisationStrings = {
    deletionSuccess: t('in-settings:tabs.deleteLogs.deletionSuccess'),
    deletionError: t('in-settings:tabs.deleteLogs.deletionError'),
    success: t('in-settings:tabs.deleteLogs.success'),
    failure: t('in-settings:tabs.deleteLogs.failure')
  };

  const isSuccess = variant === 'success';

  return (
    <div className={classNames(locals[`modalNotification-${variant}`], locals.modalNotification)}>
      {isSuccess ? (
        <SvgIcon type="lib_uncheck" color="#39BF7C" />
      ) : (
        <SvgIcon type="lib_help_error_error_circle" color="#FF4040" />
      )}
      <Typography variant="body-bold">
        {isSuccess ? localisationStrings.success : localisationStrings.failure}
      </Typography>
      <Typography variant="body-small">
        {isSuccess ? localisationStrings.deletionSuccess : localisationStrings.deletionError}
      </Typography>
      <Button onClick={onClick} kind="subtle">
        <SvgIcon type="lib_openclose_cancel" />
      </Button>
    </div>
  );
};
