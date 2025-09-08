/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { SLOPossibleConfig, SLOInferredConfig, SloSuggestion } from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import useSloConfigurations from 'in-service-levels/hooks/useSloConfigurations';
import { emptyObject } from 'in-services/fixedObjects';

/**
 * structure suggestions for slo widget
 * @param inferredConfig all final slots that are available
 * @param possibleConfig all possible slots we receive from backend
 * @returns suggestions for those slots, that could not be identified
 */
export const useSloSuggestions = (
  inferredConfig: SLOInferredConfig | null,
  possibleConfig: SLOPossibleConfig | null
) => {
  const candidateIds = possibleConfig?.sloIds;
  const sloConfigParams = candidateIds?.length && candidateIds.length < 10 ? { ids: candidateIds } : emptyObject;
  const [sloPage] = useSloConfigurations(sloConfigParams);
  const slos: SloSuggestion[] | undefined = sloPage?.items.map(slo => ({ sloId: slo.id!, name: slo.name }));

  if (inferredConfig?.name) {
    return undefined;
  }

  return slos;
};
