// @flow

// ===========================================================
//          Common Types
// ===========================================================
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

// Application 2.0 specific types
export type LogicalPluginType = 'web' | 'rpc' | 'batch' | 'sdk' | 'messaging' | 'database';
export type LogicalEntityType = 'application' | 'service' | 'endpoint';
export type LogicalEntity = {
  id: string,
  label: string,
  entityType: LogicalEntityType,

  // not available for applications
  pluginType: ?LogicalPluginType
};

// ===========================================================
//          Queries
// ===========================================================

// Get services
export type GetServicesOpts = {
  // only retrieve services of a specific application ID
  applicationId: ?string,
  timeframe: Timeframe
};
export type GetServicesItem = {
  id: string,
  label: string,
  type: LogicalPluginType,
  applications: number,
  endpoints: number,
  calls: TimestampedMetrics,
  latency: TimestampedMetrics,
  errors: TimestampedMetrics
};
export type GetServicesResult = [GetServicesItem];
export type GetServices = (opts: GetServicesOpts) => GetServicesResult;


// Get application / service / endpoint entity data
export type GetLogicalEntityOpts = {
  id: ?string,
  timeframe: Timeframe
};
export type GetLogicalEntity = (opts: GetLogicalEntityOpts) => LogicalEntity;
