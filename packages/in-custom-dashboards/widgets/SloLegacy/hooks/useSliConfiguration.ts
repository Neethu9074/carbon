/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Result, SliConfigurationWithLastUpdated } from '@instana/types';
import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getSliConfiguration } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';

export default function useSliConfiguration(sliConfigId: string): FetchedState<SliConfigurationWithLastUpdated> {
  const result = useObservable(() => loadEntity(sliConfigId), [sliConfigId]);
  return resultToFetchedStateResponse(result);
}

function loadEntity(sliConfigId: string): Observable<Result<SliConfigurationWithLastUpdated>> {
  if (isBlank(sliConfigId)) {
    return just(error([{ code: 'CLIENT', message: 'sliConfigId cannot be blank' }]));
  }

  return getSliConfiguration(sliConfigId);
}
