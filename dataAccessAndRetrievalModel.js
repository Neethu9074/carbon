// @flow

// TODO how to push queing / progress information to the UI?
// TODO how to handle data retrieval retries?


// ===========================================================
//          Common Types
// ===========================================================
export type Id = string;
// a string that would typically used in a string like operator
export type LikeString = string;

// Time
export type Millis = number;
export type Timestamp = Millis;
export type Timeframe = {
  to: ?Timestamp,
  windowSize: Millis
}

// Error
export type ErrorCode =
  // invalid user input, typically recoverable by user interaction
  'notFound' |
  // invalid user input, typically recoverable by user interaction
  'validation' |
  // invalid call, e.g. wrong call parameters - technical error
  'client' |
  // problem in server logical - technical error
  'server';
export type Error = {
  message: string,
  type: ErrorCode
}

// Results
export type Progress {
  // All of these values can be used to represent different loading indicators (and combinations thereof)
  // Indeterminate, when loading && estimatedTime == null && estimatedPercentage == null
  // Countdown, when     loading && estimatedTime > 0

  loading: bool,
  // estimated wait time in millis
  time: ?Millis,
  // estimated progress as percentage, value between 0-1
  percentage: ?number
}
export type Result<T> {
  data: ?T,
  errors: [Error],
  progress: Progress
}

// placeholder for the full Observable typings
export type Observable<T> {
  subscribe(fn: (v : T) => void)
};

// Metrics
export type Aggregations = 'sum' | 'mean' | 'max' | 'min' | 'p25' | 'p50' | 'p75' | 'p90' | 'p95' | 'p98' | 'p99';
export type MetricValue = number;
export type TimestampedMetric = [Timestamp, MetricValue];
export type TimestampedMetrics = [TimestampedMetric];
export type MetricConfiguration = {
  metric: string,
  // TODO How do we express that we only want one number?
  rollup: number,
  // aggregation to use to reduce the available number of data points to the desired number of data points
  aggregation: Aggregations
};

// Pagination
export type PaginatedOpts = {
  pageSize: number,
  page: number
};
export type PaginatedResult<T> = {
  totalHits: number,
  items: [T]
};

// Application 2.0 specific types
export type Filter = {
  // TODO document why this is filter object that is used everywhere

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
  types: [Type]
};
export type Endpoint = {
  id: Id,
  label: string,
  types: Type
};

// ===========================================================
//          Queries
// ===========================================================

export type GetApplicationsOpts = {
  filter: Filter,
  pagination: PaginatedOpts,
  // TODO how to we express the following?
  // must be a metric that returns only one data point or endpoint count, services count or application name
  orderBy: string,
  metrics: {
    [name: string]: MetricConfiguration
  }
};
export type GetApplicationsItem = {
  application: Application,
  services: number,
  endpoints: number,
  metrics: {
    [name: string]: TimestampedMetrics
  }
};
export type GetApplications = (opts: GetApplicationsOpts) => Observable<Result<PaginatedResult<GetApplicationsItem>>>;


export type GetApplicationOpts = {
  filter: Filter
};
export type GetApplication = (opts: GetApplicationOpts) => Observable<Result<Application>>;


export type GetServiceOpts = {
  filter: Filter
};
export type GetService = (opts: GetServiceOpts) => Observable<Result<Service>>;


export type GetEndpointOpts = {
  filter: Filter
};
export type GetEndpoint = (opts: GetEndpointOpts) => Observable<Result<Endpoint>>;


export type GetMetricsOpts = {
  filter: Filter,
  config: MetricConfiguration
}
export type GetMetrics = (opts: GetMetricsOpts) => Observable<Result<TimestampedMetrics>>;
