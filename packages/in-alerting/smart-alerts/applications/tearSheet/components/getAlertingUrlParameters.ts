/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  applicationId as applicationIdFromURL,
  boundaryScope as boundaryScopeFromURL,
  alertsCategory,
  isMigration,
  alertId,
  alertCreated,
  eventId,
  serviceId as serviceIdFromURL,
  endpointId as endpointIdFromURL,
  isDuplicateMode,
  isEditMode,
  isPotentialProblem
} from 'in-applications/navigation/matrix';
import { smartAlertPath, applicationsList } from 'in-applications/navigation/paths';
import { cancelUrl } from 'in-alerting/smart-alerts/components/list/constants';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';

export default function getAlertingUrlParameters(location: Location) {
  const migrationMode = getMatrixParameter(location, smartAlertPath, isMigration) === 'true';
  const editMode = getMatrixParameter(location, smartAlertPath, isEditMode) === 'true';
  const duplicateMode = getMatrixParameter(location, smartAlertPath, isDuplicateMode) === 'true';
  const potentialProblemMode = getMatrixParameter(location, smartAlertPath, isPotentialProblem) === 'true';
  const isGlobalSmartAlert = getMatrixParameter(location, smartAlertPath, alertsCategory) === 'global';

  const alertConfigId = getMatrixParameter(location, smartAlertPath, alertId) ?? '';
  const alertConfigCreated = Number(getMatrixParameter(location, smartAlertPath, alertCreated)) ?? '';
  const boundaryScope = getMatrixParameter(location, smartAlertPath, boundaryScopeFromURL);
  const applicationId = getMatrixParameter(location, smartAlertPath, applicationIdFromURL);
  const serviceId = getMatrixParameter(location, smartAlertPath, serviceIdFromURL) ?? undefined;
  const endpointId = getMatrixParameter(location, smartAlertPath, endpointIdFromURL) ?? undefined;
  const eventSpecificationId = getMatrixParameter(location, smartAlertPath, eventId) ?? '';

  const cancelTearSheet = (): string => {
    return getMatrixParameter(location, smartAlertPath, cancelUrl) ?? applicationsList;
  };

  return {
    migrationMode,
    editMode,
    duplicateMode,
    potentialProblemMode,
    isGlobalSmartAlert,
    alertConfigId,
    alertConfigCreated,
    boundaryScope,
    applicationId,
    serviceId,
    endpointId,
    eventSpecificationId,
    cancelTearSheet
  };
}
