/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

const serviceLevelsRoot = '/slo';

export const serviceLevelsOverview = serviceLevelsRoot;

export const serviceLevelsObjective = '/objective';
export const serviceLevelsObjectiveFullyQualified = `${serviceLevelsRoot}${serviceLevelsObjective}`;

export const serviceLevelsObjectiveSummary = `/summary`;
export const serviceLevelsObjectiveSummaryFullyQualified = `${serviceLevelsObjectiveFullyQualified}${serviceLevelsObjectiveSummary}`;

export const serviceLevelsObjectiveConfiguration = `/configuration`;
export const serviceLevelsObjectiveConfigurationFullyQualified = `${serviceLevelsObjectiveFullyQualified}${serviceLevelsObjectiveConfiguration}`;

export const isSloView = getRootPathPredicate(serviceLevelsRoot);
