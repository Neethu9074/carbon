/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

export const bizOpsPath = '/businessProcesses';
export const servicesPath = '/bizopsServices';
export const smartAlertsPath = '/bizopsSmartAlerts';

export const isBizOpsView = getRootPathPredicate(bizOpsPath, servicesPath, smartAlertsPath);
