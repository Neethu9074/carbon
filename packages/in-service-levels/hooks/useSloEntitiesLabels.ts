/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ServiceLevelObjectiveConfiguration, Result } from '@instana/types';
import { combineLatest } from '@instana/observables';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { loadEntities } from 'in-service-levels/utils/loadEntities';
import { pendingResult } from 'in-services/fixedObjects';
import { LabeledEntity } from 'in-service-levels/types';
import { FetchedState } from 'in-hooks/utils/types';
import { all } from 'in-hooks/utils/progress';
import { t } from 'in-i18n';

export default function useSloEntitiesLabels(
  configurations: ServiceLevelObjectiveConfiguration[]
): FetchedState<Record<string, LabeledEntity[]>> {
  const results = useObservable(
    () => combineLatest(configurations.map(({ id, entity }) => loadEntities(entity).map(res => [id, res] as const))),
    [generateStableHash(configurations.map(c => c.id))]
  );

  if (!results) {
    return resultToFetchedStateResponse(pendingResult);
  }

  const result: Result<Record<string, LabeledEntity[]>> = {
    progress: all(...results.map(r => r[1].progress)),
    // If an entity got deleted we get a NOT_FOUND error for labels from the backend and the status will be rejected.
    // However, the NOT_FOUND error is an expected error that can happen and we should display the SLO list anyway.
    // For deleted entities, non-NOT_FOUND errors are handled in the UI; once the backend is fixed, it should be handled appropriately.
    errors: results.flatMap(r => r[1].errors.filter(({ code }) => code !== 'AUTH' && code !== 'NOT_FOUND')),
    data: results.reduce((acc, [id = '', r]) => {
      const entityNotFoundErrors = r.errors.filter(({ code }) => code === 'NOT_FOUND');
      const hasEntityNotFoundErrors = entityNotFoundErrors.length > 0;
      const hasData = r.data != null && r.data.length > 0;
      const labeledEntities: LabeledEntity[] = hasData
        ? r.data.map(({ id, label }) => ({ id: id ?? '', label, deleted: hasEntityNotFoundErrors }))
        : [
            {
              id: '',
              label: entityNotFoundErrors
                ? t('in-service-levels:general.entityTypes.label', { context: 'unknown' })
                : '',
              deleted: hasEntityNotFoundErrors
            }
          ];
      const currentEntities = acc[id] ?? [];
      const newEntities = [...currentEntities, ...labeledEntities];
      return {
        ...acc,
        [id]: newEntities
      };
    }, {} as Record<string, LabeledEntity[]>)
  };
  return resultToFetchedStateResponse(result);
}
