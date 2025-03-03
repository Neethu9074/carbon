/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig } from '@instana/types';

import { defaultServiceLevelObjectiveUrlParameters } from 'in-service-levels/navigation/urlParameters';
import { serviceLevelsObjectiveSummaryFullyQualified } from 'in-service-levels/navigation/path';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { setTimeConfig } from 'in-stores/time/config';

const sloIdParameter = defaultServiceLevelObjectiveUrlParameters.sloId;

type SloDashboardHrefGenerator = (id: string, timeConfig?: TimeConfig) => string;
export default function useHrefToSloDashboard(): SloDashboardHrefGenerator {
  const { location, createHref } = useNavigation();

  return (id: string, timeConfig?: TimeConfig) => {
    location.pathname = serviceLevelsObjectiveSummaryFullyQualified;
    setOrDeleteMatrixKey(location, sloIdParameter.path ?? '', sloIdParameter.name, id!);

    if (timeConfig) {
      setTimeConfig(location, timeConfig);
    }

    return createHref(location);
  };
}
