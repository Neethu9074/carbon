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

/* A query specification that yields a list of applications. */
export type GetEndpointsQuery = {
  filter: Filter,
  pagination: PaginatedQuery,
  // the orderBy attribute refers to the ID of a metric, which must be a single data point metric
  orderBy: string,
  metrics: {
    [name: string]: MetricConfiguration
  }
};

/* An item/a row in a list or table of applications. */
export type EndpointItem = {
  endpoint: Endpoint,
  metrics: {
    [name: string]: TimestampedMetrics
  }
};

/* The operation that executes the query for a list of applications and returns the result as an observable. */
export type GetEndpoints = (query: GetEndpointsQuery) => Observable<Result<PaginatedResult<EndpointItem>>>;

export type GetEndpointQuery = {
  id: string,
  filter: Filter
};
export type GetEndpoint = (query: GetEndpointQuery) => Observable<Result<Endpoint>>;

export type GetMetricsQuery = {
  filter: Filter,
  config: MetricConfiguration
};
export type GetMetrics = (query: GetMetricsQuery) => Observable<Result<TimestampedMetrics>>;

export type PhysicalContext = {
  process: ?string,
  container: ?string,
  host: ?string,
  zone: ?string
};

export type InfrastructureFilter = Filter & {
  infrastructureName: string
};
export type InfrastructureItem = {
  physicalContext: PhysicalContext,
  metrics: {
    [name: string]: TimestampedMetrics
  }
};
export type GetInfrastructureQuery = {
  filter: InfrastructureFilter,
  pagination: PaginatedQuery,
  orderBy: string,
  metrics: {
    [name: string]: MetricConfiguration
  }
};
export type GetInfrastructure = (
  query: GetInfrastructureQuery
) => Observable<Result<PaginatedResult<InfrastructureItem>>>;

/* Flow Map Data retrieval */

export type Direction = 'incoming' | 'outgoing';
export type Id = 'string';

export type ServiceFlowNode = {
  service: Service,
  serviceMetrics: Map<string, number[][]>,

  // metrics for the connection between the last element in the path and the service
  // denoted by this node
  connectionMetrics: Map<string, number[][]>,

  relatedNodesCount: number,

  // the array length can be smaller than `relatedNodesCount` when expanding
  // the tree by critical path. The array can be empty when there are no
  // related nodes or when the related nodes haven't been retrieved.
  relatedNodes: ServiceFlowNode[]
};

export type TraversalConfiguration = {
  // restrict the number of (children) levels that should be returned. Can be optional
  // to denote that all levels should be returned.
  maxDepth: ?number,

  // optional name of a requested metric. Only those related nodes will be returned which
  // have the maximum (TBD) metric value within their siblings.
  //
  // This is expand by critical path feature.
  byMetric: ?string
};

/* a query to get the related nodes of a currently focused flow map node */
export type GetServiceFlowArgs = {
  metrics: Map<string, MetricConfiguration>,

  filter: Filter,
  traversal: TraversalConfiguration,

  // the first element within this array is always the focused service.
  path: Id[],
  direction: Direction
};

export type getServiceFlow = (args: GetServiceFlowArgs) => ServiceFlowNode[];
