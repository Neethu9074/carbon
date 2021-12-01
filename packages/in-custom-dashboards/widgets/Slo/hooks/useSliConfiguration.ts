/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getSliConfiguration } from 'in-custom-dashboards/api';
import { SliConfigurationWithLastUpdated } from 'in-types';
import { FetchedState } from 'in-hooks/utils/types';

export default function useSliConfiguration(sliConfigId: string): FetchedState<SliConfigurationWithLastUpdated> {
  const result = useObservable(() => getSliConfiguration(sliConfigId), [sliConfigId]);
  return resultToFetchedStateResponse(result);
}
