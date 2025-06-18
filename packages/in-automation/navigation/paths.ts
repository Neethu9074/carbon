/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

export const automationRoot = '/automation';

export const actionCatalog = '/actionCatalog';
export const actionCatalogFullyQualified = `${automationRoot}${actionCatalog}` as const;

export const actionDetails = '/details';
export const actionDetailsFullyQualified = `${actionCatalogFullyQualified}${actionDetails}` as const;

export const actionHistory = '/actionHistory';
export const actionHistoryPath = `${automationRoot}${actionHistory}` as const;

export const policies = '/policies';
export const policiesFullyQualified = `${automationRoot}${policies}` as const;

export const isAutomationView = getRootPathPredicate(automationRoot);

export const actionDashboard = '/actionDashboard';
export const actionDashboardFullyQualified = `${actionCatalogFullyQualified}${actionDashboard}` as const;

export const policyDetails = '/policyDetails';
export const policyDetailsFullyQualified = `${policiesFullyQualified}${policyDetails}` as const;

export const actionSummary = '/summary';
export const actionSummaryFullyQualified = `${actionDashboardFullyQualified}${actionSummary}` as const;

export const actionConfiguration = '/configuration';
export const actionConfigurationFullyQualified = `${actionDashboardFullyQualified}${actionConfiguration}` as const;
