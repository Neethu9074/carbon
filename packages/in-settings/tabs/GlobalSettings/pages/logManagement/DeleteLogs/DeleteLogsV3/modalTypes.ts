/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { NotificationState } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

export interface ValidationMessages {
  reason: string | null;
  validation: string | null;
  tagFilterExpression: string | null;
  timeRange: string | null;
}

export interface InputValues {
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  reason: string;
  validation: string;
  tagFilterExpression: FormModelElement[];
}

export interface SetInputValues {
  reason: (value: string) => void;
  validation: (value: string) => void;
  endDate: (value: Date) => void;
  endTime: (value: string) => void;
  startDate: (value: Date) => void;
  startTime: (value: string) => void;
  tagFilterExpression: (value: FormModelElement[]) => void;
}

export interface ConfirmSelectionPageProps {
  setInputValues: SetInputValues;
  inputValues: InputValues;
  validationMessages: ValidationMessages;
  isDeleting: boolean;
  notification: NotificationState;
}

export interface SelectLogsPageProps {
  setInputValues: SetInputValues;
  inputValues: InputValues;
  validationMessages: ValidationMessages;
  canGoNextStep: boolean;
}

export type DeleteLogsV3FormFields =
  | 'validation'
  | 'reason'
  | 'deletionEndDate'
  | 'deletionEndTime'
  | 'deletionStartDate'
  | 'deletionStartTime'
  | 'tagFilterExpression';
