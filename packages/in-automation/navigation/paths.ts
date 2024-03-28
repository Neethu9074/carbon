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

export const actionHistoryPath = '/actionHistory';

export const policies = '/policies';
export const policiesFullyQualified = `${automationRoot}${policies}` as const;

export const policiesDetails = '/details';
export const policiesDetailsFullyQualified = `${policiesFullyQualified}${policiesDetails}` as const;

export const isAutomationView = getRootPathPredicate(automationRoot);
