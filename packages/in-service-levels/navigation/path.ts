/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

export const serviceLevelsRoot = '/slo';

export const serviceLevelsOverview = serviceLevelsRoot;

export const serviceLevelsAlertsSegment = `/alerts`;
export const serviceLevelsAlertsFullyQualified = `${serviceLevelsRoot}${serviceLevelsAlertsSegment}` as const;

export const serviceLevelsAlertDetailsSegment = `/details`;
export const serviceLevelsAlertDetailsFullyQualified =
  `${serviceLevelsAlertsFullyQualified}${serviceLevelsAlertDetailsSegment}` as const;

export const serviceLevelsObjective = '/objective';
export const serviceLevelsObjectiveFullyQualified = `${serviceLevelsRoot}${serviceLevelsObjective}` as const;

export const serviceLevelsObjectiveSummary = `/summary`;
export const serviceLevelsObjectiveSummaryFullyQualified =
  `${serviceLevelsObjectiveFullyQualified}${serviceLevelsObjectiveSummary}` as const;

export const serviceLevelsObjectiveConfiguration = `/configuration`;
export const serviceLevelsObjectiveConfigurationFullyQualified =
  `${serviceLevelsObjectiveFullyQualified}${serviceLevelsObjectiveConfiguration}` as const;

export const serviceLevelsObjectiveAlertsFullyQualified =
  `${serviceLevelsObjectiveFullyQualified}${serviceLevelsAlertsSegment}` as const;

export const serviceLevelsObjectiveAlertDetails =
  `${serviceLevelsAlertsSegment}${serviceLevelsAlertDetailsSegment}` as const;
export const serviceLevelsObjectiveAlertDetailsFullyQualified =
  `${serviceLevelsObjectiveFullyQualified}${serviceLevelsObjectiveAlertDetails}` as const;

export const isSloView = getRootPathPredicate(serviceLevelsRoot);
