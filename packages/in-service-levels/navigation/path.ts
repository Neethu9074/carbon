/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-service-levels/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { Location } from 'in-stores/navigation/types';

export const serviceLevelsRoot = '/slo';

export const serviceLevelsOverview = serviceLevelsRoot;

export const serviceLevelsAlertsSegment = `/alerts`;
export const serviceLevelsAlertsFullyQualified = `${serviceLevelsRoot}${serviceLevelsAlertsSegment}` as const;

export const serviceLevelsCorrectionWindowsSegment = `/correctionWindows`;
export const serviceLevelsCorrectionWindowsFullyQualified =
  `${serviceLevelsRoot}${serviceLevelsCorrectionWindowsSegment}` as const;

export const serviceLevelsAlertDetailsSegment = `/details`;
export const serviceLevelsAlertDetailsFullyQualified =
  `${serviceLevelsAlertsFullyQualified}${serviceLevelsAlertDetailsSegment}` as const;

export const serviceLevelsObjective = '/objective';
export const serviceLevelsObjectiveFullyQualified = `${serviceLevelsRoot}${serviceLevelsObjective}` as const;

export const serviceLevelsObjectiveCorrectionWindowsFullyQualified =
  `${serviceLevelsObjectiveFullyQualified}${serviceLevelsCorrectionWindowsSegment}` as const;

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

export const useGetAlertConfigLink = () => {
  const { createHref, location } = useNavigation();

  return (alertConfigId: string, alertConfigVersion: number) => {
    fillAlertTabSpecificValues(location, alertConfigId, alertConfigVersion);
    return createHref(location);
  };
};

function fillAlertTabSpecificValues(location: Location, alertConfigId: string, alertConfigVersion: number) {
  location.pathname = serviceLevelsAlertDetailsFullyQualified;

  setOrDeleteMatrixKey(location, serviceLevelsAlertDetailsSegment, alertIdMatrixParam, alertConfigId);
  setOrDeleteMatrixKey(location, serviceLevelsAlertDetailsSegment, alertCreatedMatrixParam, alertConfigVersion);
}
