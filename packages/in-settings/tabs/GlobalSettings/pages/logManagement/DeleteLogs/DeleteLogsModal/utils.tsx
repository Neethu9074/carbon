/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Severity } from 'formalistic';
import React from 'react';

import { Typography } from '@instana/components';

import { DeleteLogsFormFields } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsModal/modalTypes';
import { modalLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import { formatDate, formatTimeWithoutSeconds } from 'in-services/formatters/date';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';

import locals from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogs.mless';

export const validateType = (value: string) =>
  value === 'LOGS' ? null : [{ severity: 'error' as Severity, message: modalLocalisationStrings.typeValidation }];

export const validateReason = (value: string) =>
  value.trim() ? null : [{ severity: 'error' as Severity, message: modalLocalisationStrings.reasonRequired }];

export const validateDate = (value: string) => {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const input = new Date(new Date(value).setHours(0, 0, 0, 0));
  return input <= today ? null : [{ severity: 'error' as Severity, message: modalLocalisationStrings.untilDate }];
};

export const validateTime = (value: string) => {
  const regex = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(value)
    ? null
    : [{ severity: 'error' as Severity, message: modalLocalisationStrings.correctTimeFormat }];
};

const createTodayDateWithTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(new Date().setHours(hours, minutes, 0, 0));
};

export const validateEndTimeLogic = (dateStr: string, timeStr: string) => {
  const date = new Date(new Date(dateStr).setHours(0, 0, 0, 0));
  const today = new Date(new Date().setHours(0, 0, 0, 0));

  if (date.getTime() === today.getTime()) {
    const time = createTodayDateWithTime(timeStr);
    if (time > new Date()) {
      return modalLocalisationStrings.untilTime;
    }
  }
  return null;
};

export const createInitialForm = () => {
  const form = createMapForm<Record<DeleteLogsFormFields, any>>();
  return form
    .put('validation', createField({ value: '', validator: validateType }))
    .put('reason', createField({ value: '', validator: validateReason }))
    .put('deletionEndDate', createField({ value: formatDate(new Date()) as string, validator: validateDate }))
    .put(
      'deletionEndTime',
      createField({ value: formatTimeWithoutSeconds(new Date()) as string, validator: validateTime })
    );
};

export const showToast = (
  type: 'info' | 'warning' | 'danger' | 'success',
  heading: string,
  message: string,
  id: string,
  icon: string = 'lib_help_error_info_outline'
) => {
  addMessage(
    {
      type,
      icon,
      content: (
        <section className={locals.toast}>
          <Typography variant="heading-200">{heading}</Typography>
          <Typography variant="body-regular">{message}</Typography>
        </section>
      ),
      timeout: 5000
    },
    id
  );
};
