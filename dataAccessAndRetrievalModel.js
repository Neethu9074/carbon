// @flow

// ===========================================================
//          Common Types
// ===========================================================
export type Id = string;

// Time
export type Millis = number;
export type Timestamp = Millis;
export type Timeframe = {
  to: ?Timestamp,
  windowSize: Millis
}

// Metrics
export type MetricValue = number;
export type TimestampedMetric = [Timestamp, MetricValue];
export type TimestampedMetrics = Array<TimestampedMetric>;

// Pagination
export type PaginatedOpts = {
  pageSize: number,
  page: number
};
export type PaginatedResult<T> = {
  totalHits: number,
  items: [T]
};

// Error
export type ErrorCode = 'notFound' | 'serverError';
export type Error = {
  message: string,
  type: ErrorCode
}
export type Try<T> = {
  value: T,
  errors: Error
};

// Application 2.0 specific types
export type LogicalEntityType = 'application' | 'service' | 'endpoint';
export type LogicalPluginType = 'web' | 'rpc' | 'batch' | 'sdk' | 'messaging' | 'database';
export type LogicalEntity = {
  id: Id,
  label: string,
  entityType: LogicalEntityType,
  pluginType: [LogicalPluginType]
};

// ===========================================================
//          Queries
// ===========================================================

export type GetApplicationsOpts = {
  service: ?Id,
  endpoint: ?Id,
  timeframe: Timeframe
};
export type GetApplications = (opts: GetApplicationsOpts) => Try<[Id]>;


export type GetServicesOpts = {
  application: ?Id,
  endpoint: ?Id,
  timeframe: Timeframe
};
export type GetServices = (opts: GetServicesOpts) => Try<[Id]>;


export type GetEndpointsOpts = {
  application: ?Id,
  service: ?Id,
  timeframe: Timeframe
};
export type GetEndpoints = (opts: GetEndpointsOpts) => Try<[Id]>;


export type GetLogicalEntityOpts = {
  service: ?Id,
  timeframe: Timeframe
};
export type GetLogicalEntity = (opts: GetLogicalEntityOpts) => Try<LogicalEntity>;


export type GetMetricsOpts = {
  application: ?Id,
  service: ?Id,
  endpoint: ?Id,
  timeframe: Timeframe,

  metric: string,
  // It can be that we only want to show one large number in the UI which is supposed
  desiredNumberOfDataPoints: number,
  // aggregation to use to reduce the available number of data points to the desired number of data points
  aggregation: 'mean' | 'max' | 'min' | 'p25' | 'p50' | 'p75' | 'p90' | 'p95' | 'p98' | 'p99',
  timeframe: Timeframe
}
export type GetMetrics = (opts: GetMetricsOpts) => Try<TimestampedMetrics>;
