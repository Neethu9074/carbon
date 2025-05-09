/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { DateFormatterOutput } from '@instana/format-date/types/types';

// eslint-disable-next-line no-restricted-imports
import { NotificationState } from '../types';

export interface ValidationMessages {
  reason: string | null;
  endDate: string | null;
  endTime: string | null;
  validation: string | null;
}

export interface InputValues {
  reason: string;
  endDate: DateFormatterOutput;
  endTime: string;
  validation: string;
}

export interface SetInputValues {
  reason: (value: string) => void;
  endDate: (value: string) => void;
  validation: (value: string) => void;
  endTime: (value: string) => void;
}

export interface ConfirmSelectionPageProps {
  numberLogsValue: number | undefined | string;
  setInputValues: SetInputValues;
  inputValues: InputValues;
  validationMessages: ValidationMessages;
  isDeleting: boolean;
  notification: NotificationState;
}

export interface SelectLogsPageProps {
  numberLogsValue: number | undefined | string;
  setInputValues: SetInputValues;
  inputValues: InputValues;
  validationMessages: ValidationMessages;
  canGoNextStep: boolean;
}

export type DeleteLogsFormFields = 'validation' | 'reason' | 'deletionEndDate' | 'deletionEndTime';
