declare var __DEV__: boolean;

// Time
declare type Millis = number;
declare type Timestamp = Millis;
declare type Timeframe = {
  to: ?Timestamp,
  windowSize: Millis
};

// comparing / sorting
declare type Comparator<T> = (a: ?T, b: ?T) => number;

// Error
declare type ErrorCode =
  | 'NOT_FOUND' // invalid user input, typically recoverable by user interaction
  | 'VALIDATION' // invalid user input, typically recoverable by user interaction
  | 'AUTH' // Operation not permitted due to lack of authorization
  | 'CLIENT' // invalid call, e.g. wrong call parameters - technical error
  | 'SERVER'; // problem in server logical - technical error

declare type ErrorDTO = {
  message: string,
  code: ErrorCode
};

// Results
declare type Progress = {
  // All of these values can be used to represent different loading indicators (and combinations thereof)
  // Indeterminate, when loading && (estimated) time == null && (estimated) percentage == null
  // Countdown, when     loading && estimatedTime > 0
  loading: boolean,
  percentage?: ?number,
  // an explanation as to why the user has to wait
  note?: ?string
};
declare type Result<T> = {
  data?: ?T,
  errors: ErrorDTO[],
  progress: Progress
};

// Metrics
declare type Aggregations = 'SUM' | 'MEAN' | 'MAX' | 'MIN' | 'P25' | 'P50' | 'P75' | 'P90' | 'P95' | 'P98' | 'P99';
declare type MetricValue = number;
declare type TimestampedMetric = [Timestamp, MetricValue];
declare type TimestampedMetrics = TimestampedMetric[];

declare type MetricConfiguration = {
  metric: string,
  granularity: ?number,
  // aggregation to use to reduce the available number of data points to the desired number of data points
  aggregation: Aggregations
};

// Pagination
declare type PaginatedQuery = {
  pageSize: number,
  page: number
};

declare type PaginatedResult<T> = {
  page: number,
  pageSize: number,
  totalHits: number,
  items: T[]
};
