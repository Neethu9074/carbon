/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AlertConfigType } from 'in-alerting/smart-alerts/components/AlertsBaseList';

export type ActionHandlers = {
  handleClone: (config: AlertConfigType) => void;
  handleDelete: (id: string, setIsSaving: boolean, configName: string) => void;
  handleEdit: (config: string) => void;
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (saving: boolean) => void) => void;
};

/* list action handlers specific for application smart alerts*/

export declare function actionHandlers(isGlobalSmartAlertConfig): ActionHandlers;

export declare function handleClone(config: AlertConfigType, isGlobalSmartAlertConfig: boolean);
export declare function handleDelete(
  id: string,
  setIsSaving: boolean,
  isGlobalSmartAlertConfig: boolean,
  configName: string
);
export declare function handleEdit(config: string, isGlobalSmartAlertConfig: boolean);
export declare function handleToggleEnabled(enabled: boolean, id: string, setIsSaving: (saving: boolean) => void);
