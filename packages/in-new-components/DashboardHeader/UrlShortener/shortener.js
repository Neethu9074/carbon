import { getTimeConfig, setTimeConfig, fixateTimeConfig } from 'in-stores/time/config';
import { getModifiedUrlStream, toAbsoluteUrl } from 'in-stores/navigation/navigation';
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

export function getShortUrl({ fixateTime = true } = emptyObject) {
  return getModifiedUrlStream(location => {
    if (fixateTime) {
      setTimeConfig(location, fixateTimeConfig(getTimeConfig(location)));
    }
  })
    .map(toAbsoluteUrl)
    .flatMap(getShortUrlInternal);
}
