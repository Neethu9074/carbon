/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

export const automationRoot = '/automation';
export const actionCatalogPath = `${automationRoot}/actionCatalog`;
export const actionDetailsPath = `${automationRoot}/actionCatalog/:id`;
export const actionDetailsNewPath = `${automationRoot}/actionCatalog/new`;
export const actionDetailsCopyPath = `${automationRoot}/actionCatalog/copy`;
export const actionDetailsCopyFormPath = `${automationRoot}/actionCatalog/copy/:id`;
export const actionHistoryPath = '/actionHistory';

export const policies = '/policies';
export const policiesFullyQualified = `${automationRoot}${policies}`;

export const policiesDetails = '/details';
export const policiesDetailsFullyQualified = `${policiesFullyQualified}${policiesDetails}`;

export const isAutomationView = getRootPathPredicate(automationRoot);
