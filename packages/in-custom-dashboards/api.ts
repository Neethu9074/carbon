/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Observable } from '@instana/observables';
import { generateStableHash } from '@instana/utils';

import { CreateWidgetResponse, FinalConfig, SlotsResponse } from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { CustomDashboard, CustomDashboardPreview, Result, TagCatalog, TimeConfig, UserResult } from 'in-types';
import memoize, { ObservableCreator } from 'in-services/util/memoizingObservableGenerator';
import { DEFAULT_NUMBER_ROWS } from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { refreshSignalUsers } from 'in-api/usersRefreshSignal';
import { seconds } from 'in-services/time/time';
import http from 'in-services/http';

const refreshSignal = create<string>().emit('');

export const getCustomDashboards = memoize<void, Result<CustomDashboardPreview[]>>(
  getCustomDashboardsInternal,
  () => '',
  60000
);
function getCustomDashboardsInternal() {
  return refreshSignal.flatMap(() =>
    http<CustomDashboardPreview[]>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/custom-dashboard`,
      mapToResultObject: true
    })
  );
}

export const getCustomDashboardsPaginated = ({
  page = 1,
  pageSize = DEFAULT_NUMBER_ROWS,
  query
}: {
  page: number;
  pageSize?: number;
  query?: string;
}) => {
  let url = `/api/custom-dashboard?withTotalHits=${true}&pageSize=${pageSize}&page=${page}`;
  if (query) url = `${url}&query=${query}`;
  return refreshSignal.flatMap(() =>
    http<CustomDashboardPreview[]>({
      method: 'GET',
      maxRetries: 3,
      url: url,
      mapToResultObject: true
    })
  );
};

export const searchCustomDashboards: ObservableCreator<string, Result<CustomDashboardPreview[]>> = memoize<
  string,
  Result<CustomDashboardPreview[]>
>(searchCustomDashboardInternal, query => query, 60000);

function searchCustomDashboardInternal(query: string): Observable<Result<CustomDashboardPreview[]>> {
  return refreshSignal.flatMap(() =>
    http<CustomDashboardPreview[]>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/custom-dashboard?query=${query}`,
      mapToResultObject: true
    })
  );
}

export function addCustomDashboard(customDashboard: CustomDashboard): Observable<Result<CustomDashboard>> {
  return http<CustomDashboard>({
    method: 'POST',
    maxRetries: 3,
    url: `/api/custom-dashboard`,
    headers: getCsrfHeader(),
    data: customDashboard,
    mapToResultObject: true
  }).map(res => {
    if (res.data?.id) {
      refreshSignal.emit(res.data.id);
    }
    return res;
  });
}

export const getCustomDashboard = memoize<string, Result<CustomDashboard>>(
  getCustomDashboardInternal,
  customDashboardId => customDashboardId,
  60000
);
function getCustomDashboardInternal(customDashboardId: string): Observable<Result<CustomDashboard>> {
  return refreshSignal
    .startWith(customDashboardId)
    .filter(id => id === customDashboardId)
    .flatMap(() =>
      http<CustomDashboard>({
        method: 'GET',
        maxRetries: 3,
        url: `/api/custom-dashboard/${encodeURIComponent(customDashboardId)}`,
        headers: getCsrfHeader(),
        mapToResultObject: true
      })
    );
}

export function updateCustomDashboard(customDashboard: CustomDashboard): Observable<Result<CustomDashboard>> {
  return http<CustomDashboard>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/custom-dashboard/${encodeURIComponent(customDashboard.id)}`,
    headers: getCsrfHeader(),
    data: customDashboard,
    mapToResultObject: true
  }).map(v => {
    refreshSignal.emit(customDashboard.id);
    return v;
  });
}

export function promptSlots(input: string): Observable<Result<SlotsResponse>> {
  return http<SlotsResponse>({
    method: 'POST',
    url: `/api/custom-dashboard/slots`,
    headers: getCsrfHeader(),
    responseType: 'json',
    data: { prompt: input },
    timeout: seconds.toMillis(60),
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function promptGetWidgetJson(finalConfig: FinalConfig): Observable<Result<CreateWidgetResponse>> {
  return http<CreateWidgetResponse>({
    method: 'POST',
    url: `/api/custom-dashboard/create-widget`,
    headers: getCsrfHeader(),
    responseType: 'json',
    data: { ...finalConfig },
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function removeCustomDashboard(id: string): Observable<Result<void>> {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/custom-dashboard/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  }).map(result => {
    refreshSignal.emit(id);
    return result;
  });
}

export const getUsers = memoize<void, Result<UserResult[]>>(getUsersInternal, () => '', 60000);
function getUsersInternal() {
  return refreshSignalUsers.flatMap(() =>
    http<UserResult[]>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/custom-dashboard/shareable-users`,
      mapToResultObject: true
    })
  );
}

export const getUnifiedTagCatalog = memoize(
  getUnifiedTagCatalogInternal,
  ({ timeConfig: { to, windowSize } }) => generateStableHash({ to, windowSize }),
  60000
);
function getUnifiedTagCatalogInternal({ timeConfig: { to, windowSize } }: { timeConfig: TimeConfig }) {
  return http<TagCatalog>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/tags/catalog',
    queryParams: {
      useCase: 'FILTERING',
      to,
      windowSize
    },
    mapToResultObject: true
  });
}
