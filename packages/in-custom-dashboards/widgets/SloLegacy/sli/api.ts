/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Result, SliConfigurationWithLastUpdated } from '@instana/types';
import { create, Observable } from '@instana/observables';

import { CombinedSliEntity, NewSliConfig } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignal = create<string>().emit('');

export const getSliConfigurations = memoize<void, Result<SliConfigurationWithLastUpdated[]>>(
  getConfiguredSlis,
  () => '',
  60000
);

function getConfiguredSlis() {
  return refreshSignal.flatMap(() =>
    http<SliConfigurationWithLastUpdated[]>({
      method: 'GET',
      maxRetries: 3,
      url: '/api/settings/v2/sli',
      mapToResultObject: true
    })
  );
}

export const getSliConfigurationsByEntity = memoize<
  { entityType: MonitoringSource; entityId: string },
  Result<SliConfigurationWithLastUpdated[]>
>(
  ({ entityType, entityId }) =>
    refreshSignal.flatMap(() => {
      return http<SliConfigurationWithLastUpdated[]>({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/v2/sli/${entityType}/${entityId}`,
        mapToResultObject: true
      });
    }),
  ({ entityType, entityId }) => `${entityType}-${entityId}`,
  60000
);
export const getSliConfiguration = memoize<string, Result<SliConfigurationWithLastUpdated>>(
  getConfiguredSliById,
  sliConfigId => sliConfigId,
  60000
);

function getConfiguredSliById(sliConfigId: string) {
  return refreshSignal.flatMap(() =>
    http<SliConfigurationWithLastUpdated>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/settings/v2/sli/${encodeURIComponent(sliConfigId)}`,
      headers: getCsrfHeader(),
      mapToResultObject: true
    })
  );
}

export function createSliConfiguration(
  sliConfiguration: NewSliConfig<CombinedSliEntity>
): Observable<Result<SliConfigurationWithLastUpdated>> {
  return http<SliConfigurationWithLastUpdated>({
    method: 'POST',
    maxRetries: 3,
    treat400AsError: true,
    url: `/api/settings/v2/sli`,
    headers: getCsrfHeader(),
    data: sliConfiguration,
    mapToResultObject: true
  }).map(res => {
    if (res?.data?.id) {
      refreshSignal.emit(res.data.id);
    }
    return res;
  });
}

export function deleteSliConfiguration(id: string): Observable<true> {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/v2/sli/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(() => {
    refreshSignal.emit(id);
    return true;
  });
}
