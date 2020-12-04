import createObservable from 'in-services/http/observableHttpResult';
import { roundDownToWeek } from 'in-services/util/date';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/catalog';

// observables

export const getApplicationTagCatalog = ({ dataSource, useCase }) => ({ timeConfig }) => {
  const from = timeConfig ? (timeConfig.to || Date.now()) - timeConfig.windowSize : null;
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: basePath,
      queryParams: {
        // round down the from timestamp to the beginning of the week to make the caching more efficient
        from: roundDownToWeek(from),
        dataSource: dataSource,
        useCase: useCase
      }
    })
  );
};
