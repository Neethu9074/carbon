/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import { getSliConfigurationsByEntity } from 'in-custom-dashboards/api';
import { SliConfigurationWithLastUpdated } from 'in-types';
import { FetchedState } from 'in-hooks/utils/types';
import { error } from 'in-services/util/result';

export default function useSliConfigurations(
  entityType: MonitoringSource,
  entityId: string
): FetchedState<SliConfigurationWithLastUpdated[]> {
  const getSli =
    entityType && entityId ? getSliConfigurationsByEntity : () => just(error<SliConfigurationWithLastUpdated[]>([]));
  const result = useObservable(() => getSli({ entityType, entityId }), [entityType, entityId]);
  return resultToFetchedStateResponse(result);
}
