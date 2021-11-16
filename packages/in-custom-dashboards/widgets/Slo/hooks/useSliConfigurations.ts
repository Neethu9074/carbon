/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import { getSliConfigurationsByEntity } from 'in-custom-dashboards/api';
import { hasError, isLoading, success } from 'in-services/util/result';
import { Error, SliConfigurationWithLastUpdated } from 'in-types';
import { pendingResult } from 'in-services/fixedObjects';

type ResultStatus = 'pending' | 'resolved' | 'rejected';
interface UseSliConfigurationsResult {
  readonly sliConfigurations: SliConfigurationWithLastUpdated[];
  readonly status: ResultStatus;
  readonly errors: Error[];
}

export default function useSliConfigurations(
  entityType: MonitoringSource,
  entityId: string
): UseSliConfigurationsResult {
  const getSli = entityType && entityId ? getSliConfigurationsByEntity : () => just(success([]));
  const result = useObservable(() => getSli({ entityType, entityId }), [entityType, entityId]) ?? pendingResult;

  let status: ResultStatus = 'resolved';
  if (isLoading(result)) {
    status = 'pending';
  }
  if (hasError(result)) {
    status = 'rejected';
  }

  return Object.freeze({
    sliConfigurations: result.data,
    status,
    errors: result.errors
  });
}
