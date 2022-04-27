/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getSliConfigurationsByEntity } from 'in-custom-dashboards/widgets/Slo/sli/api';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import { SliConfigurationWithLastUpdated } from 'in-types';
import { FetchedState } from 'in-hooks/utils/types';

export default function useSliConfigurations(
  entityType: MonitoringSource,
  entityId: string
): FetchedState<SliConfigurationWithLastUpdated[]> {
  const result = useObservable(() => getSliConfigurationsByEntity({ entityType, entityId }), [entityType, entityId]);
  return resultToFetchedStateResponse(result);
}
