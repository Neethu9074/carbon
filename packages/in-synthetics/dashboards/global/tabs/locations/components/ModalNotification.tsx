/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, Typography } from '@instana/components';
import { Button } from '@instana/components';

import { ModalNotificationProps } from 'in-synthetics/utils/constants';
import { t } from 'in-i18n';

import locals from './ModalNotification.mless';

export const ModalNotification = ({ variant = 'success', message, onClick = () => {} }: ModalNotificationProps) => {
  const isSuccess = variant === 'success';

  return (
    <div className={classNames(locals[`modalNotification-${variant}`], locals.modalNotification)}>
      {isSuccess ? (
        <SvgIcon type="lib_uncheck" color="#39BF7C" />
      ) : (
        <SvgIcon type="lib_help_error_error_circle" color="#FF4040" />
      )}
      <Typography variant="body-bold">
        {isSuccess
          ? t('in-synthetics:dashboard.locationList.success')
          : t('in-synthetics:dashboard.locationList.failure')}
      </Typography>
      <Typography variant="body-small">{message}</Typography>
      <Button onClick={onClick} kind="subtle">
        <SvgIcon type="lib_openclose_cancel" />
      </Button>
    </div>
  );
};
