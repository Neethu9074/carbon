/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { hasError, isLoading, success } from 'in-services/util/result';
import { Error, SliConfigurationWithLastUpdated } from 'in-types';
import { getSliConfiguration } from 'in-custom-dashboards/api';
import { pendingResult } from 'in-services/fixedObjects';

type ResultStatus = 'pending' | 'resolved' | 'rejected';
interface UseSliConfigurationResult {
  readonly sliConfiguration: SliConfigurationWithLastUpdated;
  readonly status: ResultStatus;
  readonly errors: Error[];
}

export default function useSliConfiguration(sliConfigId: string): UseSliConfigurationResult {
  const getSli = sliConfigId ? getSliConfiguration : () => just(success({}));
  const result = useObservable(() => getSli(sliConfigId), [sliConfigId]) ?? pendingResult;

  let status: ResultStatus = 'resolved';
  if (isLoading(result)) {
    status = 'pending';
  }
  if (hasError(result)) {
    status = 'rejected';
  }

  return Object.freeze({
    sliConfiguration: result.data,
    status,
    errors: result.errors
  });
}
