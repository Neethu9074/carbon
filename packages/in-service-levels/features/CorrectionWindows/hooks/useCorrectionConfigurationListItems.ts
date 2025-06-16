/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { PaginatedResult, Result, ServiceLevelObjectiveConfiguration, CorrectionConfiguration } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import useCorrectionConfigurations from 'in-service-levels/features/CorrectionWindows/hooks/useCorrectionConfigurations';
import { GetAllCorrectionConfigurationsArguments } from 'in-service-levels/api/correctionConfiguration';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getAllSloConfigurations } from 'in-service-levels/api/sloConfiguration';
import { CorrectionWindowListItem } from 'in-service-levels/types';
import { all as allProgress } from 'in-hooks/utils/progress';
import { pendingResult } from 'in-services/fixedObjects';
import { listSuccess } from 'in-services/util/result';
import { FetchedState } from 'in-hooks/utils/types';

export default function useCorrectionConfigurationListItems({
  page,
  pageSize,
  orderDirection,
  query,
  sloId,
  orderBy
}: GetAllCorrectionConfigurationsArguments): FetchedState<PaginatedResult<CorrectionWindowListItem>> {
  const [correctionConfigurationsPage, , correctionConfigurationsErrors, correctionConfigurationsProgress] =
    useCorrectionConfigurations({
      page,
      pageSize,
      orderDirection,
      query,
      sloId,
      orderBy
    });
  const correctionConfigurations = correctionConfigurationsPage?.items ?? [];
  const ids = correctionConfigurations.flatMap(({ sloIds }) => sloIds ?? []);

  const slosResult =
    useObservable(() => {
      if (ids.length === 0) return just(listSuccess<ServiceLevelObjectiveConfiguration>([]));
      return getAllSloConfigurations({
        ids,
        page: 1,
        pageSize: ids.length
      });
    }, [generateStableHash(ids)]) ?? (pendingResult as Result<PaginatedResult<ServiceLevelObjectiveConfiguration>>);

  const [slosPage, , , slosProgress] = resultToFetchedStateResponse(slosResult);
  const slos = slosPage?.items ?? [];
  const progress = allProgress(slosProgress, correctionConfigurationsProgress);
  const errors = [...correctionConfigurationsErrors];
  return [
    {
      ...correctionConfigurationsPage!,
      items: correctionConfigurations.map(configuration =>
        buildCorrectionConfigurationListItem({ configuration, slos })
      )
    },
    'resolved',
    errors,
    progress
  ];
}

function buildCorrectionConfigurationListItem({
  configuration,
  slos
}: {
  configuration: CorrectionConfiguration;
  slos: ServiceLevelObjectiveConfiguration[];
}): CorrectionWindowListItem {
  return {
    configuration,
    slos: slos.filter(slo => (configuration.sloIds ?? []).includes(slo.id!))
  };
}
