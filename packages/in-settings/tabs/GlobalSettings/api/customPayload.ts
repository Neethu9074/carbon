/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import {
  CustomPayloadConfiguration,
  CustomPayloadConfigurationWithLastUpdated,
  Result,
  TagCatalog,
  CustomPayloadContext
} from 'in-types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { Response } from 'in-services/http/types';
import http from 'in-services/http';

const basePath = '/api/events/settings/custom-payload-configurations';

const refreshCustomPayload = create<boolean>().emit(true);

function mapAndRefresh(response: Response<CustomPayloadConfigurationWithLastUpdated>) {
  refreshCustomPayload.emit(true);
  return response.body;
}

export const getGlobalCustomPayloadAsResultObservable = memoize<
  { context: CustomPayloadContext | undefined; ownerType: string | undefined },
  Result<CustomPayloadConfigurationWithLastUpdated>
>(
  getGlobalCustomPayloadAsResultObservableInternal,
  ({ context, ownerType }) => `${context ?? 'ALL'}-${ownerType ?? ''}`,
  60000
);

function getGlobalCustomPayloadAsResultObservableInternal({
  context = 'ALL',
  ownerType
}: {
  context?: CustomPayloadContext;
  ownerType?: string;
}) {
  return refreshCustomPayload.flatMap(() =>
    http<CustomPayloadConfigurationWithLastUpdated>({
      mapToResultObject: true,
      method: 'GET',
      url: basePath,
      maxRetries: 3,
      headers: getCsrfHeader(),
      queryParams: {
        context,
        ownerType
      }
    })
  );
}

export function saveGlobalCustomPayload(customPayload: CustomPayloadConfiguration) {
  return http<CustomPayloadConfigurationWithLastUpdated>({
    method: 'PUT',
    url: basePath,
    data: customPayload,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(mapAndRefresh);
}

export function getCustomPayloadTagCatalog() {
  return createObservable(
    http<TagCatalog>({
      method: 'GET',
      url: `${basePath}/catalog`,
      maxRetries: 3
    })
  );
}
