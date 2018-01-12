// @flow

// TODO how to push queing / progress information to the UI?
// TODO how to handle data retrieval retries?

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
  // BK: we specify the end and the size of the frame? That's quite unusual.
  // How about "from" and "to" or "from" and "windowSize"
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
  type: ErrorCode
};

// BK: I think for the 'validation' case we need more information. We need to tell the user what exactly was invalid.
// Do we need to render invalid inputs differently (think red border around input fields etc.)? If so, UI and backend
// need to use shared identifiers for input fields.

// Results
export type Progress = {
  // All of these values can be used to represent different loading indicators (and combinations thereof)
  // Indeterminate, when loading && (estimated) time == null && (estimated) percentage == null
  // Countdown, when     loading && estimatedTime > 0

  // BK: I think for now we should agree on and only support either estimated remaining time or estimated percentage,
  // not both. Also, I'm a bit sceptical if there is real benefit in showing the queue position (a feature that we
  // have been discussing). For now, I would not support it.

  loading: boolean,
  // estimated wait time in millis
  time: ?Millis,
  // estimated progress as percentage, value between 0-1
  percentage: ?number
};
export type Result<T> = {
  data: ?T,
  errors: [Error],
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
export type TimestampedMetrics = [TimestampedMetric];

// BK: RollupType and the two sub-types are an attempt to answer Ben's question "How do we express that we only want
// one number?". Not sure if this is very pracictal, in particular, how would the back end deserialize this union type?
export type NumericalRollup = number;
export type SingleElementRollup = 'no-rollup';
export type RollupType = NumericalRollup | SingleElementRollup;

export type MetricConfiguration = {
  metric: string,
  // TODO How do we express that we only want one number?
  rollup: RollupType,
  // aggregation to use to reduce the available number of data points to the desired number of data points
  aggregation: Aggregations
};

// Pagination
export type PagintedQuery = {
  pageSize: number,
  page: number
};
export type PaginatedResult<T> = {
  // BK: I think the pagination result also needs to know which page it is.
  page: number,
  totalHits: number,
  items: [T]
};

// Application 2.0 specific types
export type Filter = {
  // TODO document why this is a filter object that is used everywhere.
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

export type GetApplicationsQuery = {
  filter: Filter,
  pagination: PagintedQuery,
  // TODO how to we express the following?
  // must be a metric that returns only one data point or endpoint count, services count or application name
  orderBy: string,
  metrics: {
    [name: string]: MetricConfiguration
  }
};
// BK What exactly is an GetApplicationsItem? One item of the result of the GetApplicationsQuery?
// Do we need such a type? Or does it represent one row in an application table? In this case the operation that
// yielded should not be encoded into the type's name, it should simply be called ApplicationTableRow or similar.
export type GetApplicationsItem = {
  application: Application,
  services: number,
  endpoints: number,
  metrics: {
    [name: string]: TimestampedMetrics
  }
};
export type GetApplications = (query: GetApplicationsQuery) => Observable<Result<PaginatedResult<GetApplicationsItem>>>;

export type GetApplicationQuery = {
  filter: Filter
};
export type GetApplication = (query: GetApplicationQuery) => Observable<Result<Application>>;

export type GetServiceQuery = {
  filter: Filter
};
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
