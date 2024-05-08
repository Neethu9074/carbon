/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { Button } from '@instana/legacy';

import { t } from 'in-i18n';

import locals from './ModalNotification.mless';

type Variant = 'success' | 'failure';

interface ModalNotificationProps {
  variant?: Variant;
  onClick?: () => void;
}

export interface NotificationState {
  show: boolean;
  variant?: Variant;
}

export const ModalNotification = ({ variant = 'success', onClick = () => {} }: ModalNotificationProps) => {
  const localisationStrings = {
    deletionSuccess: t('in-settings:tabs.retentionPeriod.changeSuccess'),
    deletionError: t('in-settings:tabs.retentionPeriod.changeError')
  };

  const isSuccess = variant === 'success';

  return (
    <div className={classNames(locals[`modalNotification-${variant}`], locals.modalNotification)}>
      {isSuccess ? (
        <SvgIcon type="lib_uncheck" color="#39BF7C" />
      ) : (
        <SvgIcon type="lib_help_error_error_circle" color="#FF4040" />
      )}
      <Typography variant="body-small">
        {isSuccess ? localisationStrings.deletionSuccess : localisationStrings.deletionError}
      </Typography>
      <Button onClick={onClick} kind="subtle">
        <SvgIcon type="lib_openclose_cancel" />
      </Button>
    </div>
  );
};
