// @flow

// ===========================================================
//          Common Types
// ===========================================================
export type Id = string;
// a string that would typically be used in a string like operator
export type LikeString = string;

// Time
export type Millis = number;
export type Timestamp = Millis;
export type Timeframe = {
  to: ?Timestamp,
  windowSize: Millis
};

// Error
export type ErrorCode =
  // invalid user input, typically recoverable by user interaction
  | 'notFound'
  // invalid user input, typically recoverable by user interaction
  | 'validation'
  // invalid call, e.g. wrong call parameters - technical error
  | 'client'
  // problem in server logical - technical error
  | 'server';
export type Error = {
  message: string,
  code: ErrorCode
};

// Results
export type Progress = {
  // All of these values can be used to represent different loading indicators (and combinations thereof)
  // Indeterminate, when loading && (estimated) time == null && (estimated) percentage == null
  // Countdown, when     loading && estimatedTime > 0
  loading: boolean,
  // estimated wait time in millis
  time: ?Millis,
  // estimated progress as percentage, value between 0-1
  percentage: ?number
};
export type Result<T> = {
  data: ?T,
  errors: Error[],
  progress: Progress
};

// placeholder for the full Observable typings
export type Observable<T> = {
  subscribe: (v: ?T) => void
};

// Metrics
export type Aggregations = 'sum' | 'mean' | 'max' | 'min' | 'p25' | 'p50' | 'p75' | 'p90' | 'p95' | 'p98' | 'p99';
export type MetricValue = number;
export type TimestampedMetric = [Timestamp, MetricValue];
export type TimestampedMetrics = TimestampedMetric[];

export type MetricConfiguration = {
  metric: string,
  granularity: ?number,
  // aggregation to use to reduce the available number of data points to the desired number of data points
  aggregation: Aggregations
};

// Pagination
export type PaginatedQuery = {
  pageSize: number,
  page: number
};

export type PaginatedResult<T> = {
  page: number,
  pageSize: number,
  totalHits: number,
  items: T[]
};

// Application 2.0 specific types
export type Filter = {
  application: ?Id,
  applicationName: ?LikeString,
  service: ?Id,
  serviceName: ?LikeString,
  endpoint: ?Id,
  endpointName: ?LikeString,
  timeframe: Timeframe
};

export type Type = 'web' | 'rpc' | 'batch' | 'sdk' | 'messaging' | 'database' | 'website';

export type Application = {
  id: Id,
  label: string
};

export type Service = {
  id: Id,
  label: string,
  types: Type[]
};

export type Endpoint = {
  id: Id,
  label: string,
  types: Type
};

// ===========================================================
//          Queries
// ===========================================================

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
  id: Id,
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
  id: Id,
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
