/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import { defaultServiceLevelObjectiveUrlParameters } from 'in-service-levels/navigation/urlParameters';
import { serviceLevelsObjectiveFullyQualified } from 'in-service-levels/navigation/path';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

const sloIdParameter = defaultServiceLevelObjectiveUrlParameters.sloId;

type SloDashboardNavigator = (slo: ServiceLevelObjectiveConfiguration) => void;
export default function useNavigateToSloDashboard(): SloDashboardNavigator {
  const { location, navigate } = useNavigation();

  return (slo: ServiceLevelObjectiveConfiguration) => {
    location.pathname = serviceLevelsObjectiveFullyQualified;
    setOrDeleteMatrixKey(location, sloIdParameter.path ?? '', sloIdParameter.name, slo.id!);
    navigate(location);
  };
}
