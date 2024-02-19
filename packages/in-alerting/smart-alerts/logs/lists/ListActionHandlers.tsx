/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';

export const actionHandlers = {
  handleDelete: (id: string, setIsSaving: (saving: boolean) => void, configName: string) =>
    handleDelete(id, setIsSaving, configName, baseUrl.LOGS),
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) =>
    handleToggleEnabled(enabled, id, setIsSaving, baseUrl.LOGS)
};
