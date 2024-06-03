/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';

import {
  defaultServiceLevelObjectiveUrlParameters,
  sloSmartAlertDetailsUrlParameters
} from 'in-service-levels/navigation/urlParameters';
import { serviceLevelsObjectiveAlertDetailsFullyQualified } from 'in-service-levels/navigation/path';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

interface UseHrefToSloAlertConfigProps {
  sloId: string;
  config: ServiceLevelsAlertConfigWithMetadata;
}

const alertIdParameter = sloSmartAlertDetailsUrlParameters.alertId;
const sloIdParameter = defaultServiceLevelObjectiveUrlParameters.sloId;
const alertCreatedParameter = sloSmartAlertDetailsUrlParameters.alertCreated;

export default function useHrefToSloAlertConfig({ sloId, config }: UseHrefToSloAlertConfigProps): string {
  const { location, createHref } = useNavigation();

  location.pathname = serviceLevelsObjectiveAlertDetailsFullyQualified;
  setOrDeleteMatrixKey(location, sloIdParameter.path ?? '', sloIdParameter.name, sloId);
  setOrDeleteMatrixKey(location, alertIdParameter.path ?? '', alertIdParameter.name, config.id);
  setOrDeleteMatrixKey(location, alertCreatedParameter.path ?? '', alertCreatedParameter.name, config.created);

  return createHref(location);
}
