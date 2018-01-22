// @flow

import type { Observable } from 'reactive-observables';

/*
 * Application 2.0 specific types
 */

export type Filter = {
  application: ?string,
  applicationName: ?string,
  service: ?string,
  serviceName: ?string,
  endpoint: ?string,
  endpointName: ?string,
  timeframe: Timeframe
};

export type Type = 'WEB' | 'RPC' | 'BATCH' | 'SDK' | 'MESSAGING' | 'DATABASE' | 'WEBSITE';

export type Application = {
  id: string,
  label: string
};

export type Service = {
  id: string,
  label: string,
  types: Type[]
};

export type Endpoint = {
  id: string,
  label: string,
  types: Type
};

/* A query specification that yields a list of applications. */
export type GetApplicationsQuery = {
  filter: Filter,
  pagination: PaginatedQuery,
  // the orderBy attribute refers to the ID of a metric, which must be a single data point metric
  orderBy: string,
  metrics: {
    [name: string]: MetricConfiguration
  }
};

/* An item/a row in a list or table of applications. */
export type ApplicationItem = {
  application: Application,
  metrics: {
    [name: string]: TimestampedMetrics
  }
};

/* The operation that executes the query for a list of applications and returns the result as an observable. */
export type GetApplications = (query: GetApplicationsQuery) => Observable<Result<PaginatedResult<ApplicationItem>>>;

/* A query specification that yields a single application.
 * The filter might result in a subset of the data for the application being returned, also
 * the filter needs to include the timeframe.
 */
export type GetApplicationQuery = {
  id: string,
  filter: ?Filter
};

/* The operation that executes the query for a single application and returns the result as an observable. */
export type GetApplication = (query: GetApplicationQuery) => Observable<Result<Application>>;

/* A query specification that yields a list of services */
export type GetServicesQuery = {
  filter: Filter,
  pagination: PaginatedQuery,
  // the orderBy attribute refers to the ID of a metric, which must be a single data point metric
  orderBy: string,
  metrics: {
    [name: string]: MetricConfiguration
  }
};

/* An item/a row in a list or table of services. */
export type ServiceItem = {
  service: Service,
  metrics: {
    [name: string]: TimestampedMetrics
  }
};

/* The operation that executes the query for a list of services and returns the result as an observable. */
export type GetServices = (query: GetServicesQuery) => Observable<Result<PaginatedResult<ServiceItem>>>;

/* A query specification that yields a single service.
 * The filter might result in a subset of the data for the service being returned, also
 * the filter needs to include the timeframe.
 */
export type GetServiceQuery = {
  id: string,
  filter: ?Filter
};

/* The operation that executes the query for a single service and returns the result as an observable. */
export type GetService = (query: GetServiceQuery) => Observable<Result<Service>>;

export type GetEndpointQuery = {
  filter: Filter
};

export type GetEndpoint = (query: GetEndpointQuery) => Observable<Result<Endpoint>>;

export type GetMetricsQuery = {
  filter: Filter,
  config: MetricConfiguration
};
export type GetMetrics = (query: GetMetricsQuery) => Observable<Result<TimestampedMetrics>>;
