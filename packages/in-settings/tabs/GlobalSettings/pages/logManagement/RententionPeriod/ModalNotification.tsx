/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, Typography, Button } from '@instana/components';

import { t } from 'in-i18n';

import locals from './ModalNotification.mless';

type Variant = 'success' | 'failure';

interface ModalNotificationProps {
  variant?: Variant;
  onClick?: () => void;
  valueDays: number | undefined | string;
}

export interface NotificationState {
  show: boolean;
  variant?: Variant;
}

export const ModalNotification = ({ variant = 'success', onClick = () => {}, valueDays }: ModalNotificationProps) => {
  const localisationStrings = {
    changeSuccess: t('in-settings:tabs.retentionPeriod.changeSuccess', { value: valueDays }),
    changeError: t('in-settings:tabs.retentionPeriod.changeError')
  };

  const isSuccess = variant === 'success';

  return (
    <div
      data-testid={`retention-change-notification-${variant}`}
      className={classNames(locals[`modalNotification-${variant}`], locals.modalNotification)}
    >
      {isSuccess ? (
        <SvgIcon type="lib_uncheck" color="#39BF7C" />
      ) : (
        <SvgIcon type="lib_help_error_error_circle" color="#FF4040" />
      )}
      <Typography variant="body-small">
        {isSuccess ? localisationStrings.changeSuccess : localisationStrings.changeError}
      </Typography>
      <Button onClick={onClick} kind="subtle">
        <SvgIcon type="lib_openclose_cancel" />
      </Button>
    </div>
  );
};
