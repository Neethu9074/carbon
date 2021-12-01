/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getSliConfiguration } from 'in-custom-dashboards/api';
import { SliConfigurationWithLastUpdated } from 'in-types';
import { FetchedState } from 'in-hooks/utils/types';
import { error } from 'in-services/util/result';

export default function useSliConfiguration(sliConfigId: string): FetchedState<SliConfigurationWithLastUpdated> {
  const getSli = sliConfigId ? getSliConfiguration : () => just(error<SliConfigurationWithLastUpdated>([]));
  const result = useObservable(() => getSli(sliConfigId), [sliConfigId]);
  return resultToFetchedStateResponse(result);
}
