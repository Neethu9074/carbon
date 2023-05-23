/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useCallback } from 'react';

import { getTimeConfig, setTimeConfig, fixateTimeConfig } from 'in-stores/time/config';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
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

export function useShortUrl() {
  const { location, createHref } = useNavigation();

  return useCallback(
    ({ fixateTime = true } = emptyObject) => {
      const clonedLocation = cloneLocation(location);

      if (fixateTime) {
        setTimeConfig(clonedLocation, fixateTimeConfig(getTimeConfig(clonedLocation)));
      }

      const href = createHref(clonedLocation);
      const absoluteUrl = toAbsoluteUrl(href);

      return getShortUrlInternal(absoluteUrl);
    },
    [location, createHref]
  );
}

function toAbsoluteUrl(partialUrl) {
  return window.location.origin + partialUrl;
}
