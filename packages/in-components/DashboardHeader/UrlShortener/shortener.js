/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getTimeConfig, setTimeConfig, fixateTimeConfig } from 'in-stores/time/config';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { emptyObject } from 'in-services/fixedObjects';
import { identity } from 'in-services/util/function';
import { hours } from 'in-services/time';
import http from 'in-services/http';

const getShortUrlInternal = memoize(
  url =>
    createObservable(
      http({
        method: 'POST',
        maxRetries: 3,
        url: `/api/shortUrls`,
        headers: getCsrfHeader(),
        queryParams: {
          url
        }
      })
    ),
  identity,
  hours.toMillis(1)
);

export function useShortUrl({ fixateTime = true } = emptyObject) {
  const { location, createHref } = useNavigation();

  if (fixateTime) {
    setTimeConfig(location, fixateTimeConfig(getTimeConfig(location)));
  }

  const href = createHref(location);
  const absoluteUrl = toAbsoluteUrl(href);

  return getShortUrlInternal(absoluteUrl);
}

function toAbsoluteUrl(partialUrl) {
  return window.location.origin + partialUrl;
}
