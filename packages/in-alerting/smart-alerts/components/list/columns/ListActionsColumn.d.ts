/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ActionHandlers, AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';

export type ListActionsColumnProps = {
  config: AlertConfigType;
  isLoading: boolean;
  actionHandlers: ActionHandlers;
  icon?: string;
  useSmartAlertCreateUrl?: (args: AlertURLProps) => string;
};

export function ListActionsColumn({
  config,
  isLoading,
  actionHandlers = {},
  icon,
  useSmartAlertCreateUrl
}: ListActionsColumnProps);
