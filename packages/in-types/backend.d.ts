/* tslint:disable */
/* eslint-disable */

import { TimeConfig } from 'in-types/time';

export interface TimeShift {
  readonly offset: number;
}

export interface AppDataEntityChain extends Cursorific<IngestionOffsetCursor> {
  readonly applicationId: string;
  readonly applicationName: string;
  readonly serviceId?: string;
  readonly serviceName?: string;
  readonly endpointId?: string;
  readonly endpointName?: string;
  readonly endpointType?: EndpointType;
  readonly cursor: IngestionOffsetCursor;
}

export interface Application {
  readonly id: string;
  readonly label: string;
  readonly boundaryScope: string;
  readonly entityType?: UiEntityType;
}

export interface ApplicationCursorPaginatedItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly application: Application;
  readonly cursor: IngestionOffsetCursor;
  readonly metrics: { [index: string]: number[][] };
}

export interface ApplicationItem extends Metricific {
  readonly application: Application;
  readonly metrics: { [index: string]: number[][] };
}

export interface PotentialProblems {
  readonly thresholds?: { [index: string]: Threshold };
  readonly alerts?: Alert[];
}

export interface Alert {
  readonly key?: string;
  readonly start: number;
  readonly end: number;
}

export interface GetAppDataEntityChainsQuery extends CursorPaginatedQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly includeSynthetic: boolean;
  readonly includeInternal: boolean;
  readonly searchTerm: string;
  readonly level: Level;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly rbacRestrictions?: any;
}

export interface GetApplicationAlertClustersQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly granularity: number;
  readonly applicationId?: string;
  readonly serviceId?: string;
  readonly endpointId?: string;
  readonly rbacRestrictions?: any;
}

export interface GetApplicationLiveViewQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly pagination: Pagination;
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly downstreamScope: ApplicationDownstreamScope;
}

export interface GetApplicationMetricsAlertPreviewQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly threshold: Threshold;
  readonly timeThreshold: ApplicationTimeThreshold;
  readonly rbacRestrictions?: any;
}

export interface GetApplicationMetricsAlertPreviewQueryWithClustering extends GetApplicationMetricsAlertPreviewQuery {
  readonly granularity: number;
}

export interface GetApplicationMetricsThresholdSuggestionQuery extends AbstractThresholdSuggestionQuery {
  readonly metric: AppDataMetricConfiguration;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly alertEvaluationType?: AlertEvaluationType;
  readonly evaluationType?: AlertEvaluationType;
}

export interface GetApplicationPotentialProblemsQuery extends FilteredQuery {
  readonly timeConfig: TimeConfig;
  readonly alertRules?: { [index: string]: AlertRuleWithGranularity };
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly includeSynthetic: boolean;
  readonly includeInternal: boolean;
}

export interface AlertRuleWithGranularity {
  readonly rule: ApplicationAlertRule;
  readonly granularity: Granularity;
  readonly operator: ThresholdOperator;
  readonly seasonality?: Seasonality;
  readonly timeThreshold: ApplicationTimeThreshold;
}

export interface GetApplicationQuery extends UiQuery {
  readonly id: string;
  readonly rbacRestrictions?: any;
}

export interface GetApplicationsCursorPaginatedQuery
  extends CursorPaginatedQuery,
    QueryWithMetrics,
    QueryWithPrecision {
  readonly filter: Filter;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly contextScope?: ContextScope;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly supportedOrderByCriteria: boolean;
}

export interface GetApplicationsQuery extends PaginatedQuery {
  readonly filter: Filter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly contextScope?: ContextScope;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly supportedOrderByCriteria: boolean;
}

export interface CloudfoundryApplication {
  readonly id: string;
  readonly guid: string;
  readonly label: string;
  readonly organization?: string;
  readonly space?: string;
  readonly foundation?: string;
  readonly buildpack?: string;
  readonly createdAt?: number;
  readonly lastUpdated?: number;
  readonly status?: string;
  readonly routes: string[];
  readonly diskLimit?: number;
  readonly memoryLimit?: number;
}

export interface CloudfoundryApplicationLink {
  readonly snapshotId: string;
  readonly guid: string;
  readonly name: string;
  readonly space: string;
  readonly organization: string;
  readonly entityHealthInfo?: EntityHealthInfo;
  readonly healthInfo?: EntityHealthInfo;
}

export interface CloudfoundryApplicationListItem extends FilterableListItem {
  readonly id: string;
  readonly label: string;
  readonly status: string;
  readonly organization?: string;
  readonly space?: string;
  readonly foundation?: string;
  readonly memoryLimit?: number;
  readonly routes: string[];
  readonly entityHealthInfo: EntityHealthInfo;
}

export interface CloudfoundryContainer {
  readonly id: string;
  readonly label: string;
  readonly plugin: string;
  readonly cfInstanceIndex?: string;
}

export interface CloudfoundryContainerListItem extends FilterableListItem {
  readonly container: CloudfoundryContainer;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly containerLabel?: string;
  readonly cfInstanceIndex?: string;
}

export interface GetApplicationServiceIdForCloudfoundryApplicationServiceUidQuery extends UiQuery {
  readonly order?: Order;
  readonly metrics?: { [index: string]: AppDataMetricConfiguration };
  readonly timeConfig: TimeConfig;
  readonly appId: string;
  readonly rbacRestrictions?: any;
  readonly entityId?: string;
}

export interface GetCloudfoundryApplicationQuery extends UiQuery {
  readonly filter: CloudfoundryQueryFilter;
  readonly rbacRestrictions?: any;
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface GetCloudfoundryApplicationsByTagsQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters: TagFilter[];
}

export interface GetCloudfoundryApplicationsForApplicationServiceQuery extends UiQuery {
  readonly applicationId?: string;
  readonly serviceId: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
}

export interface GetCloudfoundryApplicationsQuery extends PaginatedQuery {
  readonly filter: CloudfoundryQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface GetCloudfoundryContainersQuery extends PaginatedQuery {
  readonly filter: CloudfoundryQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface DomainSpecificStack {
  readonly groups: ContextGuideGroup[];
  readonly healthInfo?: HealthInfo;
}

export interface DomainSpecificStackBuilder {}

export interface GetStackForEndpointQuery extends GetStackQuery {
  readonly applicationId?: string;
}

export interface GetStackForServiceQuery extends GetStackQuery {
  readonly applicationId?: string;
}

export interface GetStackQuery {
  readonly id: string;
  readonly timeConfig: TimeConfig;
}

export interface ContextGuideGroup {
  readonly relationship: Relationship;
  readonly type: string;
  readonly itemCount: number;
  readonly items: Item[];
}

export interface GroupBuilder {
  readonly items?: Item[];
}

export interface GroupKey {
  readonly relationship?: Relationship;
  readonly type?: string;
  readonly contextGuideGroup?: EntityContextGuideGroup;
}

export interface HealthInfo {
  readonly type: Type;
  readonly explanation: string;
  readonly partOfIncident: boolean;
}

export interface Item {
  readonly id: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly type: string;
  readonly healthInfo?: HealthInfo;
  readonly metrics: { [index: string]: number[][] };
}

export interface ServiceStackItem extends Item {
  readonly endpointTypes?: string[];
  readonly technologies?: string[];
}

export interface Stack {
  readonly application: DomainSpecificStack;
  readonly infrastructure: DomainSpecificStack;
  readonly kubernetes?: DomainSpecificStack;
  readonly healthInfo?: HealthInfo;
}

export interface DatabaseStatementTopListItem {
  readonly id: string;
  readonly statement: string;
  readonly metricValue: number;
}

export interface GetDatabaseStatementTopListQuery extends TopListQuery {
  readonly filter: Filter;
  readonly metric: MetricConfiguration;
}

export interface Endpoint {
  readonly id: string;
  readonly label: string;
  readonly type: EndpointType;
  readonly serviceId: string;
  readonly technologies: string[];
  readonly syntheticType?: EndpointSyntheticType;
  readonly synthetic?: boolean;
  readonly entityType?: UiEntityType;
  readonly isSynthetic?: boolean;
}

export interface EndpointCursorPaginatedItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly endpoint: Endpoint;
  readonly cursor: IngestionOffsetCursor;
  readonly metrics: { [index: string]: number[][] };
}

export interface EndpointInfo {
  readonly id: string;
  readonly label: string;
  readonly serviceId: string;
}

export interface EndpointItem extends Metricific {
  readonly endpoint: Endpoint;
  readonly metrics: { [index: string]: number[][] };
}

export interface EndpointPreview {
  readonly label: string;
}

export interface EndpointQueryConstants {}

export interface EndpointTypeSummary {
  readonly type: EndpointType;
  readonly metrics: { [index: string]: number[][] };
}

export interface GetEndpointInfoQuery extends UiQuery {
  readonly id: string;
}

export interface GetEndpointQuery extends FilteredQuery {
  readonly id: string;
  readonly filter: Filter;
}

export interface GetEndpointTypesQuery extends FilteredQuery {
  readonly filter: Filter;
}

export interface GetEndpointsCursorPaginatedQuery extends CursorPaginatedQuery, QueryWithMetrics, QueryWithPrecision {
  readonly filter: Filter;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly supportedOrderByCriteria: boolean;
}

export interface GetEndpointsQuery extends PaginatedQuery {
  readonly filter: Filter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly supportedOrderByCriteria: boolean;
}

export interface Error {
  readonly message: string;
  readonly code: ErrorCode;
}

export interface ErrorMessageItem {
  readonly message: string;
  readonly metrics: { [index: string]: number[][] };
}

export interface GetErrorMessagesMetricConfiguration extends MetricConfiguration {}

export interface GetErrorMessagesQuery extends PaginatedQuery {
  readonly filter: Filter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: GetErrorMessagesMetricConfiguration };
  readonly supportedOrderByCriteria: boolean;
}

export interface Message {
  readonly title: string;
  readonly text: string;
  readonly errorCode: ErrorCode;
  readonly subscriptionId?: number;
}

export interface AgentMonitoringIssueWithSnapshot {
  readonly id: string;
  readonly start: number;
  readonly triggeringTime: number;
  readonly end?: number;
  readonly agentMonitoringCode: string;
  readonly agentMonitoringCategory: string;
  readonly agentMonitoringArguments?: { [index: string]: any };
  readonly affectedEntityId: string;
  readonly affectedEntitySnapshot?: SnapshotPreview;
}

export interface CursoredEvent extends Event, Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
}

export interface Event {
  readonly id: string;
  readonly start: number;
  readonly triggeringTime: number;
  readonly end?: number;
  readonly type: string;
  readonly state: string;
  readonly problem?: Problem;
  readonly metadata?: { [index: string]: any };
  readonly entityId: string;
  readonly endpointServiceId?: string;
  readonly entityType?: EntityType;
  readonly metricAccessId?: string;
}

export interface GetOpenEventsCountTimeSeriesQuery {
  readonly timeConfig: TimeConfig;
  readonly query?: string;
  readonly granularity: number;
}

export interface Incident extends Event {
  readonly recentEvents?: string[];
  readonly triggeringEvent: string;
  readonly issueOrderMap?: { [index: string]: number };
}

export interface Problem {
  readonly id: string;
  readonly severity: number;
  readonly problemText?: string;
  readonly fixSuggestion?: string;
}

export interface RawEvent extends Cursorific<IngestionOffsetCursor> {
  readonly id?: string;
  readonly title?: string;
  readonly start: number;
  readonly triggeringTime: number;
  readonly end?: number;
  readonly type?: string;
  readonly state?: string;
  readonly severity: number;
  readonly entityId?: string;
  readonly entityType?: EntityType;
  readonly metricAccessId?: string;
  readonly cursor: IngestionOffsetCursor;
}

export interface RawEventInTimeframe {
  readonly id?: string;
  readonly type?: EventTypes;
}

export interface GetInternalEventsQuery extends CursorPaginatedQuery {
  readonly timeConfig: TimeConfig;
  readonly query?: string;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
}

export interface GetRawEventsQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly query?: string;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
}

export interface AvailableMetrics {
  readonly metrics?: MetricMetadata[];
}

export interface AvailablePlugins {
  readonly plugins?: string[];
}

export interface GetAvailableMetricsQuery {
  readonly filter: TagSetFilter;
  readonly type?: string;
  readonly query?: string;
}

export interface GetAvailablePluginsQuery {
  readonly filter: TagSetFilter;
}

export interface GetInfraMetricsCatalogQuery {
  readonly filter: TagSetFilter;
  readonly type?: string;
  readonly query?: string;
}

export interface GetInfrastructureGroupsQuery {
  readonly filter: TagSetFilter;
  readonly pagination?: CursorPagination<IngestionOffsetCursor>;
  readonly groupBy: string[];
  readonly type?: string;
  readonly metrics?: { [index: string]: InfraMetricQuery };
  readonly order?: Order;
  readonly firstPageOnly: boolean;
}

export interface GetInfrastructureExploreQuery {
  readonly filter: TagSetFilter;
  readonly pagination?: CursorPagination<IngestionOffsetCursor>;
  readonly order?: Order;
  readonly type?: string;
  readonly metrics?: { [index: string]: InfraMetricQuery };
}

export interface GetMetricMetadataQuery {
  readonly type: string;
  readonly metric: string;
}

export interface GetInfrastructureExploreTagValueSuggestionsQuery {
  readonly tagName?: string;
  readonly timeConfig?: TimeConfig;
  readonly partialValue?: string;
  readonly valueCount: number;
}

export interface InfraMetricQuery {
  readonly metric: string;
  readonly granularity?: number;
  readonly aggregation: AggregationType;
}

export interface InfraTagValueSuggestions {
  readonly suggestions?: string[];
  readonly totalHits: number;
}

export interface InfrastructureGroup {
  readonly tags?: { [index: string]: any };
  readonly count: number;
  readonly metrics?: { [index: string]: number[][] };
}

export interface InfrastructureExploreItem {
  readonly snapshotId?: string;
  readonly label?: string;
  readonly plugin?: string;
  readonly time: number;
  readonly metrics?: { [index: string]: number[][] };
}

export interface Fields {}

export interface MetricMetadata {
  readonly ownerType?: string;
  readonly infraTagCategory: InfraTagCategory;
  readonly id?: string;
  readonly category?: string;
  readonly label?: string;
  readonly format?: Formatter;
}

export interface TagSetFilter {
  readonly timeConfig: TimeConfig;
  readonly tagFilterExpression: TagFilterExpressionElement;
}

export interface EndpointPathSegment {
  readonly service: string;
  readonly endpoint: string;
}

export interface FlowNode {
  readonly service: Service;
  readonly endpoint?: Endpoint;
  readonly applications: Application[];
  readonly metrics: { [index: string]: number[][] };
  readonly connectionMetrics: { [index: string]: number[][] };
  readonly relatedNodesCount: number;
  readonly relatedNodes?: FlowNode[];
}

export interface GetFlowMapNodesQuery extends PaginatedQuery {
  readonly filter: Filter;
  readonly pagination: Pagination;
  readonly metrics: { [index: string]: MetricConfiguration };
  readonly direction: FlowDirection;
  readonly traversalConfiguration: ServiceFlowTraversalConfig;
}

export interface ServiceFlowTraversalConfig {
  readonly maxDepth?: number;
  readonly byMetric?: string;
}

export interface GetWiringEdgesQuery extends UiQuery {
  readonly timeframe: Timeframe;
}

export interface EntityHealthInfo {
  readonly maxSeverity: number;
  readonly openIssues: Event[];
}

export interface GetApplicationEntityHealthInfoQuery {
  readonly applicationId?: string;
  readonly serviceId?: string;
  readonly endpointId?: string;
  readonly timeConfig: TimeConfig;
}

export interface GetWebsiteHealthInfoQuery {
  readonly websiteId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetEntitiesHealthQuery extends UiQuery {
  readonly ids: string[];
  readonly timeConfig: TimeConfig;
}

export interface GetEntityHealthQuery extends UiQuery {
  readonly snapshotId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetLatencyHeatMapOverTimeQuery extends FilteredQuery {
  readonly filter: Filter;
  readonly maxTimeBuckets: number;
  readonly maxLatencyBuckets: number;
}

export interface CloudfoundryPhysicalContext {
  readonly application?: SnapshotPreview;
  readonly space?: SnapshotPreview;
  readonly organization?: SnapshotPreview;
  readonly cfInstanceIndex?: string;
}

export interface FilterableListItem {}

export interface GetInfrastructureQuery extends PaginatedQuery {
  readonly filter: Filter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: MetricConfiguration };
  readonly category: string;
  readonly includeApplicationFilter: boolean;
}

export interface GetRelatedPluginsQuery extends PaginatedUIQuery {
  readonly timeConfig?: TimeConfig;
  readonly tagFilterExpression?: TagFilterExpression;
  readonly topSnapshotsPagination?: Pagination;
}

export interface InfrastructureItem {
  readonly physicalContext: PhysicalContext;
  readonly metrics: { [index: string]: number[][] };
}

export interface KubernetesPhysicalContext {
  readonly pod?: SnapshotPreview;
  readonly namespace?: SnapshotPreview;
  readonly node?: SnapshotPreview;
  readonly cluster?: SnapshotPreview;
}

export interface PaginatedRelatedSnapshots {
  readonly items?: SnapshotItem[];
  readonly totalHits: number;
}

export interface PhysicalContext {
  readonly process?: SnapshotPreview;
  readonly container?: SnapshotPreview;
  readonly host?: SnapshotPreview;
  readonly cluster?: SnapshotPreview;
  readonly cloudfoundry?: CloudfoundryPhysicalContext;
  readonly kubernetes?: KubernetesPhysicalContext;
}

export interface RelatedPluginItem {
  readonly pluginId?: string;
  readonly topSnapshots?: PaginatedRelatedSnapshots;
}

export interface SnapshotItem {
  readonly id?: string;
  readonly time: number;
  readonly metrics?: { [index: string]: number[][] };
}

export interface GetReferencesQuery {
  readonly config: { [index: string]: string };
}

export interface References {
  readonly timeConfig?: TimeConfig;
  readonly infrastructureEntities: SnapshotPreview[];
  readonly applications: Application[];
  readonly services: ServiceLabel[];
  readonly endpoints: EndpointInfo[];
  readonly traceIds: string[];
}

export interface AbstractKubernetesContainerState {
  readonly status?: string;
  readonly terminated: boolean;
  readonly running: boolean;
  readonly waiting: boolean;
}

export interface ComponentStatus {
  readonly name: string;
  readonly conditionStatus?: string;
  readonly conditionMessage?: string;
}

export interface GetApplicationServiceIdForKubernetesServiceUidQuery extends UiQuery {
  readonly kubernetesServiceId: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
}

export interface GetKubernetesClusterByRelationQuery extends UiQuery, FilteredQuery {
  readonly filter: KubernetesClusterQueryFilter;
}

export interface GetKubernetesClusterQuery extends UiQuery {
  readonly id: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface GetKubernetesClustersQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics?: { [index: string]: KubernetesMetricConfiguration };
}

export interface GetKubernetesConditionsQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface GetKubernetesContainersQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface GetKubernetesCronJobQuery extends UiQuery {
  readonly id: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesCronJobsQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface GetKubernetesEndpointsQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface GetKubernetesEventsQuery extends UiQuery {
  readonly filter: KubernetesQueryFilter;
  readonly query?: string;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly rbacRestrictions?: any;
}

export interface GetKubernetesGraphRelationsQuery extends UiQuery {
  readonly filter: KubernetesQueryFilter;
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface GetKubernetesHostByNodeQuery extends UiQuery, FilteredQuery {
  readonly filter: KubernetesQueryFilter;
}

export interface GetKubernetesHostsByClusterQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface GetKubernetesJobsQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface GetKubernetesMonitoringStateQuery {
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesNamespaceQuery extends UiQuery {
  readonly id: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface GetKubernetesNamespacesQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly granularity: number;
}

export interface GetKubernetesNodeByHostQuery extends UiQuery, FilteredQuery {
  readonly filter: KubernetesQueryFilter;
}

export interface GetKubernetesNodeQuery extends UiQuery {
  readonly id: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface GetKubernetesNodesQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly granularity: number;
}

export interface GetKubernetesPersistentVolumesQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly granularity: number;
}

export interface GetKubernetesPodQuery extends UiQuery {
  readonly id: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface GetKubernetesPodsQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly granularity: number;
}

export interface GetKubernetesServiceForApplicationServiceIdQuery extends UiQuery {
  readonly serviceId: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
}

export interface GetKubernetesServiceQuery extends UiQuery {
  readonly id: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface GetKubernetesServicesByTagsQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters: TagFilter[];
}

export interface GetKubernetesServicesForApplicationServiceQuery extends UiQuery {
  readonly applicationId?: string;
  readonly serviceId: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
}

export interface GetKubernetesServicesQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface GetKubernetesTreemapQuery extends UiQuery {
  readonly grouping?: KubernetesTreemapGrouping;
  readonly filter: KubernetesQueryFilter;
}

export interface GetKubernetesWorkloadControllerQuery extends UiQuery {
  readonly id: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface GetKubernetesWorkloadControllersQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly granularity: number;
}

export interface KubernetesAnnotation {
  readonly key: string;
  readonly value: string;
}

export interface KubernetesCluster {
  readonly id: string;
  readonly clusterDistribution: string;
  /**
   * @deprecated
   */
  readonly clusterManagedBy: string;
  readonly clusterManagement: KubernetesClusterManagement;
  readonly label: string;
  readonly version: string;
  readonly componentStatuses: ComponentStatus[];
  readonly debuggingInfo?: { [index: string]: any };
  readonly missingAppsPermissions: boolean;
}

export interface KubernetesClusterListItem extends FilterableListItem {
  readonly id?: string;
  readonly cluster: KubernetesCluster;
  readonly namespaces: number;
  readonly nodes: number;
  readonly services: number;
  readonly persistentVolumes: number;
  readonly workloads: WorkloadCounters;
  readonly cronJobs: number;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly name?: string;
}

export interface KubernetesClusterManagement {
  readonly shortName: string;
  readonly fullName: string;
}

export interface KubernetesCondition {
  readonly type: string;
  readonly status: string;
  readonly message: string;
  readonly reason: string;
  readonly lastTransitionTime: string;
}

export interface KubernetesConditionListItem extends FilterableListItem {
  readonly type: string;
  readonly status: string;
  readonly lastTransitionTime: string;
  readonly reason?: string;
  readonly message: string;
}

export interface KubernetesContainer {
  readonly id: string;
  readonly label: string;
  readonly uid: string;
  readonly plugin: string;
}

export interface KubernetesContainerListItem extends FilterableListItem {
  readonly container: KubernetesContainer;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly containerLabel?: string;
}

export interface KubernetesContainerStateRunning extends AbstractKubernetesContainerState {}

export interface KubernetesContainerStateTerminated extends AbstractKubernetesContainerState {
  readonly exitCode: number;
  readonly signal: number;
  readonly reason?: string;
}

export interface KubernetesContainerStateWaiting extends AbstractKubernetesContainerState {
  readonly reason?: string;
}

export interface KubernetesContainerStatus {
  readonly name: string;
  readonly containerSnapshotId: string;
  readonly state: AbstractKubernetesContainerState;
  readonly ready: boolean;
}

export interface KubernetesCronJob {
  readonly id?: string;
  readonly name?: string;
  readonly schedule?: string;
  readonly lastScheduled?: string;
  readonly concurrencyPolicy?: string;
  readonly labels?: KubernetesLabel[];
  readonly conditions: KubernetesCondition[];
  readonly entityId?: EntityId;
  readonly entityHealthInfo: EntityHealthInfo;
}

export interface KubernetesCronJobListItem extends FilterableListItem {
  readonly cronJob: KubernetesCronJob;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly cronJobName?: string;
}

export interface KubernetesEndpoint {
  readonly serviceUid: string;
  readonly pods: number;
  readonly internal: number;
  readonly external: number;
}

export interface KubernetesEndpointAddressListItem extends FilterableListItem {
  readonly address: string;
  readonly port?: number;
  readonly portName?: string;
  readonly protocol?: string;
  readonly ready?: boolean;
  readonly podName?: string;
  readonly podSnapshotId?: string;
}

export interface KubernetesEventListItem extends FilterableListItem {
  readonly time: number;
  readonly type?: string;
  readonly name?: string;
  readonly namespace?: string;
  readonly kind?: string;
  readonly title?: string;
  readonly detailText?: string;
  readonly sourcePlugin?: string;
  readonly sourceId?: string;
}

export interface KubernetesHostListItem extends FilterableListItem {
  readonly id: string;
  readonly label?: string;
  readonly plugin: string;
}

export interface KubernetesIds {
  readonly clusterId?: string;
  readonly namespaceId?: string;
  readonly workloadControllerId?: string;
  readonly workloadControllerType?: string;
  /**
   * @deprecated
   */
  readonly deploymentId?: string;
}

export interface KubernetesIdsBuilder {
  readonly clusterId?: string;
  readonly namespaceId?: string;
  readonly workloadControllerId?: string;
  readonly workloadControllerType?: string;
}

export interface KubernetesJob {
  readonly id: string;
  readonly label: string;
  readonly clusterId: string;
  readonly namespace: string;
  readonly cronJobOwner: string;
  readonly startAt: string;
  readonly completedAt?: string;
  readonly age: number;
  readonly status: string;
  readonly labels: KubernetesLabel[];
  readonly entityHealthInfo: EntityHealthInfo;
}

export interface KubernetesJobListItem extends FilterableListItem {
  readonly job: KubernetesJob;
  readonly podIds?: string[];
  readonly entityHealthInfo: EntityHealthInfo;
  readonly namespace?: string;
  readonly age?: number;
  readonly label?: string;
  readonly status?: string;
}

export interface KubernetesLabel {
  readonly key: string;
  readonly value: string;
}

export interface KubernetesNamespace {
  readonly id: string;
  readonly clusterDistribution: string;
  readonly label: string;
  readonly labels: KubernetesLabel[];
  readonly clusterName: string;
  readonly status: string;
  readonly age?: number;
  readonly entityId?: EntityId;
}

export interface KubernetesNamespaceListItem extends FilterableListItem, ListItemWithMetric {
  readonly id?: string;
  readonly namespace: KubernetesNamespace;
  readonly pods: number;
  readonly services: number;
  readonly workloads: WorkloadCounters;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly label?: string;
  readonly clusterName?: string;
}

export interface KubernetesNode {
  readonly id: string;
  readonly clusterDistribution: string;
  readonly name: string;
  readonly status: string;
  readonly roles?: string;
  readonly internalIp: string;
  readonly externalIp?: string;
  readonly machineId: string;
  readonly bootId: string;
  readonly version: string;
  readonly hostname: string;
  readonly clusterId: string;
  readonly age?: number;
  readonly labels: KubernetesLabel[];
  readonly conditions: KubernetesCondition[];
  readonly entityId?: EntityId;
}

export interface KubernetesNodeListItem extends ListItemWithMetric, FilterableListItem {
  readonly node: KubernetesNode;
  readonly pods: number;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly age?: number;
  readonly roles?: string;
  readonly version?: string;
  readonly status?: string;
  readonly name?: string;
}

export interface KubernetesPersistentVolume {
  readonly id: string;
  readonly phase: string;
  readonly reclaimPolicy: string;
  readonly volumeMode: string;
  readonly storageClassName: string;
  readonly labels: KubernetesLabel[];
  readonly name: string;
  readonly entityId: EntityId;
}

export interface KubernetesPersistentVolumeListItem extends FilterableListItem {
  readonly persistentVolume: KubernetesPersistentVolume;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly phase?: string;
  readonly name?: string;
}

export interface KubernetesPod {
  readonly id: string;
  readonly clusterDistribution: string;
  readonly label: string;
  readonly clusterId: string;
  readonly namespace: string;
  readonly hostIp: string;
  readonly podIp: string;
  readonly age?: number;
  readonly status?: KubernetesPodStatus;
  readonly labels: KubernetesLabel[];
  readonly conditions: KubernetesCondition[];
  readonly resources: { [index: string]: KubernetesResources };
  readonly volumes: number;
  readonly entityId?: EntityId;
}

export interface KubernetesPodCondition {
  readonly reason: string;
  readonly message: string;
  readonly type: string;
  readonly status: string;
}

export interface KubernetesPodListItem extends ListItemWithMetric, FilterableListItem {
  readonly pod: KubernetesPod;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly statusSummary?: string;
  readonly namespace?: string;
  readonly age?: number;
  readonly phase?: string;
  readonly label?: string;
}

export interface KubernetesPodStatus {
  readonly phase: string;
  readonly reason?: string;
  readonly message?: string;
  readonly initContainerStatuses: KubernetesContainerStatus[];
  readonly containerStatuses: KubernetesContainerStatus[];
  readonly statusSummary?: string;
}

export interface KubernetesPort {
  readonly name: string;
  readonly port?: string;
  readonly protocol: string;
  readonly nodePort?: string;
  readonly targetPort?: string;
}

export interface KubernetesResources {
  readonly cpuLimits: number;
  readonly memoryLimits: number;
  readonly cpuRequests: number;
  readonly memoryRequests: number;
}

export interface KubernetesSelector {
  readonly key: string;
  readonly value: string;
}

export interface KubernetesService {
  readonly id: string;
  readonly clusterDistribution: string;
  readonly uid: string;
  readonly name: string;
  readonly clusterName: string;
  readonly namespace: string;
  readonly selector: string;
  readonly type: string;
  readonly location: string;
  readonly age: number;
  readonly created: number;
  readonly deploymentIds: string[];
  readonly labels: KubernetesLabel[];
  readonly selectors: KubernetesSelector[];
  readonly ports: KubernetesPort[];
}

export interface KubernetesServiceLink {
  readonly snapshotId: string;
  readonly uid: string;
  readonly name: string;
  readonly type: string;
  readonly clusterName: string;
  readonly namespace: string;
  readonly entityHealthInfo?: EntityHealthInfo;
  readonly healthInfo?: EntityHealthInfo;
}

export interface KubernetesServiceListItem extends FilterableListItem {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly type: string;
  readonly namespace: string;
  readonly internalEndpoints: number;
  readonly externalEndpoints: number;
  readonly pods: number;
  readonly age: number;
  readonly entityHealthInfo: EntityHealthInfo;
}

export interface KubernetesWorkloadController {
  readonly id: string;
  readonly clusterDistribution: string;
  readonly name: string;
  readonly namespace: string;
  readonly clusterId: string;
  readonly labels: KubernetesLabel[];
  readonly conditions: KubernetesCondition[];
  readonly entityId?: EntityId;
}

export interface KubernetesWorkloadControllerListItem extends ListItemWithMetric, FilterableListItem {
  readonly workloadController: KubernetesWorkloadController;
  readonly pods: number;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly deploymentConfig?: KubernetesWorkloadController;
  readonly deployment?: KubernetesWorkloadController;
  readonly namespace?: string;
  readonly name?: string;
}

export interface ListItemWithMetric {
  readonly sortedMetricValue?: number;
  readonly entityIdForMetric?: EntityId;
  readonly snapshotIdForMetric?: string;
}

export interface DefaultComparator extends Comparator<any> {}

export interface EntityHealthInfoComparator extends Comparator<EntityHealthInfo> {}

export interface KubernetesJobStatusComparator extends Comparator<string> {}

export interface KubernetesPodPhaseComparator extends Comparator<string> {}

export interface KubernetesPodStatusComparator extends Comparator<string> {}

export interface GetKubernetesClusterItemCountersQuery {
  readonly clusterId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesCronJobItemCountersQuery {
  readonly cronJobId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesNamespaceItemCountersQuery {
  readonly namespaceId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesNodeItemCountersQuery {
  readonly nodeId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesServiceItemCountersQuery {
  readonly serviceId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesWorkloadControllerItemCountersQuery {
  readonly workloadControllerId: string;
  readonly timeConfig: TimeConfig;
}

export interface KubernetesClusterItemCounters {
  readonly nodes: number;
  readonly hosts: number;
  readonly namespaces: number;
  readonly services: number;
  readonly persistentVolumes: number;
  readonly cronJobs: number;
  readonly workloads: WorkloadCounters;
}

export interface KubernetesCronJobItemCounters {
  readonly jobs: number;
  readonly pods: number;
}

export interface KubernetesNamespaceItemCounters {
  readonly services: number;
  readonly cronJobs: number;
  readonly workloads: WorkloadCounters;
  readonly volumes: number;
}

export interface KubernetesNodeItemCounters {
  readonly pods: number;
  readonly volumes: number;
}

export interface KubernetesServiceItemCounters {
  readonly workloads: WorkloadCounters;
}

export interface KubernetesWorkloadControllerItemCounters {
  readonly pods: number;
  readonly services: number;
  readonly nodes: number;
  readonly volumes: number;
}

export interface WorkloadCounters {
  readonly daemonSets: number;
  readonly deployments: number;
  readonly deploymentConfigs: number;
  readonly statefulSets: number;
  readonly pods: number;
}

export interface GetLatencyDistributionBase10Query extends FilteredQuery {
  /**
   * @deprecated
   */
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly filter: FilterInterface;
  readonly maxLatencyBuckets: number;
  readonly dataSource?: DataSource;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly timeShift?: TimeShift;
  readonly includePercentiles: boolean;
}

export interface RequestQuoteQuery {
  readonly companyName: string;
  readonly numberOfApmHosts: number;
  readonly numberOfInfrastructureHosts: number;
  readonly numberOfYears: number;
  readonly billingStreet: string;
  readonly billingCity: string;
  readonly billingCountry: string;
  readonly billingState: string;
  readonly billingZip: string;
}

export interface FullLogItem {
  readonly id: string;
  readonly timestamp: number;
  readonly tags: LoggingTag[];
  readonly content: string;
}

export interface GetLogGroupsQuery extends CursorPaginatedQuery, FilteredQuery {
  readonly groupBy?: string;
  readonly timeConfig: TimeConfig;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface GetLogMessagesQuery extends PaginatedQuery {
  readonly filter: Filter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: MetricConfiguration };
  readonly supportedOrderByCriteria: boolean;
}

export interface GetLogQuery extends FilteredQuery {
  readonly id: string;
  readonly timeConfig?: TimeConfig;
}

export interface GetLogsDistributionQuery extends FilteredQuery {
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
  readonly granularity: number;
}

export interface GetLogsForConsoleQuery extends CursorPaginatedQuery, FilteredQuery {
  readonly timeConfig: TimeConfig;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface GetLogsQuery extends CursorPaginatedQuery, FilteredQuery {
  readonly order: Order;
  readonly timeConfig: TimeConfig;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface GetTagValueSuggestionsQuery extends FilteredQuery {
  readonly key?: string;
  readonly value?: string;
  readonly tagName: string;
  readonly timeConfig: TimeConfig;
  readonly propose: TagSuggestionProposeType;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface LoggingGroup {
  readonly label: string;
}

export interface Log {
  readonly id: string;
  readonly timestamp: number;
  readonly tags: LoggingTag[];
  readonly content: string;
}

export interface LoggingLogGroupItem extends Cursorific<IngestionOffsetCursor> {
  readonly group: LoggingGroup;
  readonly cursor: IngestionOffsetCursor;
}

export interface LoggingLogItem extends Cursorific<IngestionOffsetCursor> {
  readonly log: Log;
  readonly cursor: IngestionOffsetCursor;
}

export interface LogMessageItem {
  readonly message: string;
  readonly level: string;
  readonly metrics: { [index: string]: number[][] };
}

export interface LogsAvailable {
  readonly containsLogs: boolean;
}

export interface LoggingTag {
  readonly tag: LoggingLogTag;
  readonly value: string;
}

export interface HasLogsQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface HasLogsResult {
  readonly hasLogs: boolean;
}

export interface LogGroupItem extends Cursorific<IngestionOffsetCursor> {
  readonly label: string;
  readonly numberOfLogs: number;
  readonly percentage: number;
  readonly cursor: IngestionOffsetCursor;
}

export interface LogGroupsQuery {
  readonly timeConfig: TimeConfig;
  readonly group: Group;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagTagFilterExpression?: TagFilterExpressionElement;
}

export interface LogItem {
  readonly itemId: string;
  readonly timestamp: number;
  readonly message: string;
  readonly tags: LogTag[];
}

export interface LogQuery {
  readonly itemId: string;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface LogTag {
  readonly name?: string;
  readonly key?: string;
  readonly stringValue?: string;
  readonly longValue?: number;
  readonly doubleValue?: number;
  readonly booleanValue?: boolean;
}

export interface LogTagSuggestionsQuery {
  readonly key?: string;
  readonly value?: string;
  readonly tagName: string;
  readonly propose?: TagSuggestionProposeType;
  readonly timeConfig: TimeConfig;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface LogsDistributionQuery {
  readonly granularity: number;
  readonly timeConfig: TimeConfig;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface LogsQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly retrievalSize: number;
  readonly beforeKey?: string;
  readonly afterKey?: string;
  readonly tags?: string[];
}

export interface LogsResult {
  readonly items?: LogItem[];
  readonly beforeKey?: string;
  readonly afterKey?: string;
  readonly percentage: number;
}

export interface AppDataMetricConfiguration extends MetricConfiguration {}

export interface GetApplicationMetricsQuery extends QueryWithMetrics, UiQuery, QueryWithPrecision {
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly dataSource?: MetricDataSource;
  readonly rbacRestrictions?: any;
}

export interface GetMetricsQuery extends QueryWithMetrics {
  readonly filter: Filter;
  readonly metrics: { [index: string]: MetricConfiguration };
}

export interface KubernetesMetricConfiguration extends MetricConfiguration {}

export interface MetricConfiguration {
  readonly metric: string;
  readonly granularity?: number;
  readonly aggregation: AggregationType;
}

export interface MetricQuery {
  readonly snapshotId: string;
  readonly metric: string;
  readonly timeConfig: TimeConfig;
  readonly rollup?: number;
  readonly aggregation?: AggregationType;
  readonly rollupOrDefault: number;
}

export interface AppDataEntityChainItem extends Cursorific<IngestionOffsetCursor> {
  readonly appDataEntityChain: AppDataEntityChain;
  readonly cursor: IngestionOffsetCursor;
}

export interface GetRetentionResult {
  readonly containsHistoricData: boolean;
  readonly retention: number;
}

export interface GetSamplingLevelQuery extends UiQuery, QueryWithPrecision {
  readonly timeConfig: TimeConfig;
}

export interface GetSamplingLevelResult {
  readonly level: number;
  readonly samplingRatio: number;
}

export interface GetTagAvailabilityQuery extends UiQuery {
  readonly tagNames?: string[];
}

export interface GetTagAvailabilityResult {
  readonly tagAvailabilities?: { [index: string]: TagAvailability };
}

export interface TagAvailability {
  readonly availableFrom: number;
}

export interface MobileApp {
  readonly id: string;
  readonly label: string;
}

export interface GetMobileAppBeaconsForSessionQuery extends UiQuery {
  readonly sessionId: string;
  readonly beaconTimestamp?: number;
  readonly userId?: string;
  readonly rbacRestrictions?: any;
}

export interface GetMobileAppMetricsQuery extends QueryWithMetrics, UiQuery {
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
  readonly metrics: { [index: string]: MobileAppMonitoringMetricsConfiguration };
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface GetMobileAppQuery extends UiQuery {
  readonly id: string;
  readonly rbacRestrictions?: any;
}

export interface MobileAppBeaconTagGroup extends Group {}

export interface MobileAppMonitoringMetricsConfiguration extends MetricConfiguration {}

export interface GetMobileAppBeaconGroupsQuery extends QueryWithMetrics, CursorPaginatedQuery {
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly metrics: { [index: string]: MobileAppMonitoringMetricsConfiguration };
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly group: MobileAppBeaconTagGroup;
  readonly includeOthers: boolean;
}

export interface MobileAppBeaconGroupsItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly name: string;
  readonly earliestTimestamp: number;
  readonly cursor: IngestionOffsetCursor;
  readonly metrics: { [index: string]: number[][] };
}

export interface GetMobileAppBeaconsQuery extends CursorPaginatedQuery {
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly rbacRestrictions?: any;
}

export interface MobileAppBeaconsItem extends Cursorific<IngestionOffsetCursor> {
  readonly beacon: MobileAppMonitoringBeacon;
  readonly cursor: IngestionOffsetCursor;
}

export interface GetMobileAppCountryBreakdownQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly rbacRestrictions?: any;
}

export interface MobileAppCountryBreakdown {
  readonly continent: string;
  readonly continentCode: string;
  readonly country: string;
  readonly countryCode: string;
  readonly sessions: number;
}

export interface GetMobileAppPaginatedBeaconGroupsQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: MobileAppMonitoringMetricsConfiguration };
  readonly group: MobileAppBeaconTagGroup;
  readonly rbacRestrictions?: any;
}

export interface MobileAppPaginatedBeaconGroupsItem {
  readonly name: string;
  readonly earliestTimestamp: number;
  readonly metrics: { [index: string]: number[][] };
}

export interface GetMobileAppSubdivisionsQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: MobileAppMonitoringMetricsConfiguration };
  readonly rbacRestrictions?: any;
}

export interface MobileAppSubdivisionsItem {
  readonly continent: string;
  readonly continentCode: string;
  readonly country: string;
  readonly countryCode: string;
  readonly subdivision: string;
  readonly subdivisionCode?: string;
  readonly metrics: { [index: string]: number[][] };
}

export interface GetMobileAppsQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly labelFilter?: string;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: MobileAppMonitoringMetricsConfiguration };
  readonly rbacRestrictions?: any;
}

export interface MobileAppItem {
  readonly mobileApp: MobileApp;
  readonly metrics: { [index: string]: number[][] };
}

export interface Cursor {}

export interface CursorPaginatedResult<ITEM> {
  readonly items: ITEM[];
  readonly canLoadMore: boolean;
  readonly totalHits: number;
  readonly totalRepresentedItemCount: number;
}

export interface CursorPaginatedWithNext<ITEM, CURSOR> {
  readonly items: ITEM[];
  readonly canLoadMore: boolean;
  readonly totalHits: number;
  readonly totalRepresentedItemCount: number;
  readonly next?: CURSOR;
}

export interface CursorPagination<CURSOR_TYPE> {
  readonly cursor?: CURSOR_TYPE;
  readonly retrievalSize: number;
}

export interface Cursorific<T> {
  readonly cursor?: T;
}

export interface IngestionOffsetCursor extends Cursor {
  readonly ingestionTime: number;
  readonly offset: number;
}

export interface Order {
  readonly by: string;
  readonly direction: OrderDirection;
}

export interface PaginatedResult<T> {
  readonly items: T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalHits: number;
}

export interface Pagination {
  readonly page: number;
  readonly pageSize: number;
}

export interface GetProcessesByIdsQuery extends CursorPaginatedQuery {
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly processSnapshotIds: string[];
  readonly timeConfig: TimeConfig;
}

export interface GetProcessesQuery extends CursorPaginatedQuery {
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly query?: string;
  readonly timeConfig: TimeConfig;
}

export interface GetProfiledProcessesAvailableQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
}

export interface GetProfilesAvailableQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly processSnapshotId?: string;
}

export interface GetProfilesQuery extends FilteredQuery {
  readonly filter: Filter;
  readonly processSnapshotId?: string;
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface ProcessGroup {
  readonly groupName: string;
  readonly technologies: string[];
  readonly metrics: { [index: string]: number[][] };
}

export interface ProcessGroupsItem extends Cursorific<IngestionOffsetCursor> {
  readonly processGroup: ProcessGroup;
  readonly cursor: IngestionOffsetCursor;
}

export interface ProcessesItem extends Cursorific<IngestionOffsetCursor> {
  readonly profiledProcess: ProfiledProcess;
  readonly cursor: IngestionOffsetCursor;
}

export interface Profile {
  readonly runtime: string;
  readonly type: string;
  readonly unit: string;
  readonly numProcesses: number;
  readonly profilePaths?: ProfilePath[];
  readonly profileGraph?: ProfileNode[];
  readonly rawProfileTimestamps?: number[];
}

export interface ProfileNode {
  readonly methodName?: string;
  readonly fileName?: string;
  readonly fileLine: number;
  readonly measurement: number;
  readonly percent: number;
  readonly numSamples: number;
  readonly children?: ProfileNode[];
}

export interface ProfilePath {
  readonly numProcesses: number;
  readonly profileNodes?: ProfileNode[];
}

export interface ProfiledProcess {
  readonly processSnapshotId: string;
  readonly time: number;
  readonly metrics: { [index: string]: number[][] };
  readonly entityPlugin?: string;
  readonly entityLabel: string;
  readonly hostSnapshotPreview?: SnapshotPreview;
}

export interface ProfiledProcessesAvailable {
  readonly containsProfiledProcesses: boolean;
}

export interface ProfilesAvailable {
  readonly containsProfiles: boolean;
}

export interface ProfilesItem {
  readonly cpuProfile?: Profile;
  readonly memoryProfile?: Profile;
  readonly timeProfile?: Profile;
}

export interface GetProfilesQueryBuilder {}

export interface AbstractThresholdSuggestionQuery extends ThresholdSuggestionQuery, UiQuery {
  readonly type: ThresholdType;
  readonly operator: ThresholdOperator;
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly rbacRestrictions?: any;
}

export interface CloudfoundryQueryFilter extends FilterInterface {
  readonly label?: string;
  readonly applicationId?: string;
  readonly containerId?: string;
  readonly timeConfig: TimeConfig;
}

export interface CursorPaginatedQuery extends UiQuery {
  readonly pagination?: CursorPagination<any>;
}

export interface ExtendedMetricsTimeConfig extends TimeConfig {}

export interface Filter extends FilterInterface {
  readonly label?: string;
  readonly application?: string;
  readonly service?: string;
  readonly endpoint?: string;
  readonly endpointName?: string;
  readonly endpointTypes?: EndpointType[];
  readonly technologies?: string[];
  readonly timeConfig: TimeConfig;
  readonly processReference?: EntityId;
  readonly includeSyntheticCalls: boolean;
  readonly includeInternalCalls: boolean;
  readonly useLongTermDataOnly: boolean;
  readonly applicationBoundaryScope?: ApplicationBoundaryScope;
}

export interface FilterInterface {
  readonly timeConfig?: TimeConfig;
  readonly rbacRestrictions?: any;
}

export interface FilteredQuery extends UiQuery {
  readonly filter?: FilterInterface;
}

export interface Group {
  readonly groupbyTag: string;
  readonly groupbyTagSecondLevelKey?: string;
  readonly groupbyTagEntity: TagFilterEntity;
}

export interface KubernetesClusterQueryFilter extends FilterInterface {
  readonly resourceSnapshotId?: string;
  readonly timeConfig: TimeConfig;
}

export interface KubernetesQueryFilter extends FilterInterface {
  readonly label?: string;
  readonly serviceId?: string;
  readonly clusterId?: string;
  readonly namespaceId?: string;
  readonly podId?: string;
  readonly nodeId?: string;
  readonly workloadControllerId?: string;
  readonly workloadOwnerId?: string;
  readonly daemonSetId?: string;
  readonly deploymentId?: string;
  readonly deploymentConfigId?: string;
  readonly hostId?: string;
  readonly phase?: string;
  readonly statefulSetId?: string;
  readonly cronJobId?: string;
  readonly timeConfig: TimeConfig;
}

export interface PaginatedQuery extends QueryWithMetrics, PaginatedUIQuery {}

export interface PaginatedUIQuery extends UiQuery {
  readonly order?: Order;
  readonly pagination?: Pagination;
}

export interface QueryWithMetrics extends FilteredQuery {
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface QueryWithPrecision {
  readonly queryPrecision?: QueryPrecision;
}

export interface ThresholdSuggestionQuery {
  readonly metric?: MetricConfiguration;
  readonly operator?: ThresholdOperator;
  readonly seasonality?: Seasonality;
  readonly fallbackOnError: boolean;
  readonly type?: ThresholdType;
}

export interface TimeConfig {
  readonly windowSize: number;
  readonly to: number | null;
  readonly focusedMoment: number | null;
  readonly autoRefresh: boolean;
}

export interface TopListQuery extends FilteredQuery {
  readonly metric?: MetricConfiguration;
}

export interface UiQuery {}

export interface VsphereQueryFilter extends FilterInterface {
  readonly label?: string;
  readonly timeConfig: TimeConfig;
  readonly datacenterId?: string;
  readonly hostId?: string;
  readonly vmId?: string;
  readonly snapshotId?: string;
}

export interface FilterBuilder {
  readonly label?: string;
  readonly application?: string;
  readonly service?: string;
  readonly endpoint?: string;
  readonly endpointName?: string;
  readonly endpointTypes?: EndpointType[];
  readonly technologies?: string[];
  readonly timeConfig?: TimeConfig;
  readonly processReference?: EntityId;
  readonly includeSyntheticCalls: boolean;
  readonly includeInternalCalls: boolean;
  readonly useLongTermDataOnly: boolean;
  readonly applicationBoundaryScope?: ApplicationBoundaryScope;
}

export interface KubernetesClusterQueryFilterBuilder {
  readonly resourceSnapshotId?: string;
  readonly timeConfig?: TimeConfig;
}

export interface KubernetesQueryFilterBuilder {
  readonly label?: string;
  readonly serviceId?: string;
  readonly clusterId?: string;
  readonly namespaceId?: string;
  readonly podId?: string;
  readonly nodeId?: string;
  readonly workloadControllerId?: string;
  readonly daemonSetId?: string;
  readonly deploymentId?: string;
  readonly deploymentConfigId?: string;
  readonly hostId?: string;
  readonly phase?: string;
  readonly statefulSetId?: string;
  readonly cronJobId?: string;
  readonly timeConfig?: TimeConfig;
  readonly workloadOwnerId?: string;
}

export interface ApplicationScope {
  readonly name: string;
}

export interface ApplicationScopeWithId {
  readonly id: string;
  readonly name?: string;
}

export interface Release {
  readonly name: string;
  readonly start: number;
  readonly services?: ServiceScope[];
  readonly applications?: ApplicationScope[];
}

export interface ReleaseCluster {
  readonly timestamp: number;
  readonly clusteredReleases?: ReleaseWithId[];
}

export interface ReleaseScope {
  readonly serviceId?: string;
  readonly serviceName?: string;
  readonly applicationId?: string;
  readonly applicationName?: string;
}

export interface ReleaseWithId {
  readonly id: string;
  readonly name: string;
  readonly start: number;
  readonly lastUpdated: number;
  readonly services?: ServiceScopeWithId[];
  readonly applications?: ApplicationScopeWithId[];
  readonly scopes?: ReleaseScope[];
}

export interface ReleaseWithIdInternal extends ReleaseWithId {}

export interface ServiceScope {
  readonly name: string;
  readonly scopedTo?: ServiceScopedTo;
}

export interface ServiceScopeWithId {
  readonly id: string;
  readonly name?: string;
  readonly scopedTo?: ServiceScopedToWithId;
}

export interface ServiceScopedTo {
  readonly applications: ApplicationScope[];
}

export interface ServiceScopedToWithId {
  readonly applications: ApplicationScopeWithId[];
}

export interface GetReleaseClustersQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly granularity: number;
  readonly serviceId?: string;
  readonly applicationId?: string;
}

export interface GetReleasesQuery extends PaginatedUIQuery {
  readonly timeConfig?: TimeConfig;
  readonly filter?: string;
  readonly pagination: Pagination;
}

export interface LatencyBucket {
  readonly from: number;
  readonly to: number;
  readonly calls: number;
}

export interface LatencyBucketBase10 {
  readonly from: number;
  readonly to?: number;
  readonly tickMark: boolean;
  readonly calls: number;
}

export interface LatencyDistributionBase10 {
  readonly buckets: LatencyBucketBase10[];
  readonly percentiles?: LatencyPercentileBase10[];
}

export interface LatencyPercentileBase10 {
  readonly percentile: number;
  readonly latency: number;
}

export interface ListWithTotal<T> {
  readonly items?: T[];
  readonly totalHits: number;
}

export interface Metricific {
  readonly metrics?: { [index: string]: number[][] };
}

export interface Progress {
  readonly percentage?: number;
  readonly loading: boolean;
  readonly note?: string;
}

export interface Result<T> {
  readonly data?: T;
  readonly time?: number;
  readonly adjustedWindowSize?: number;
  readonly errors: Error[];
  readonly progress: Progress;
}

export interface TimeBucket {
  readonly from: number;
  readonly to: number;
  readonly latencyBuckets: LatencyBucket[];
}

export interface GetServiceLabelQuery extends UiQuery {
  readonly id: string;
}

export interface GetServiceLinksByTagsQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters: TagFilter[];
  readonly order: Order;
  readonly metrics: { [index: string]: MetricConfiguration };
  readonly rbacRestrictions?: any;
}

export interface GetServiceQuery extends FilteredQuery {
  readonly id: string;
  readonly filter: Filter;
}

export interface GetServicesCursorPaginatedQuery extends CursorPaginatedQuery, QueryWithMetrics, QueryWithPrecision {
  readonly filter: Filter;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly contextScope?: ContextScope;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
}

export interface GetServicesQuery extends PaginatedQuery {
  readonly filter: Filter;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly contextScope?: ContextScope;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
}

export interface Service {
  readonly id: string;
  readonly label: string;
  readonly types: EndpointType[];
  readonly technologies: string[];
  readonly entityType?: UiEntityType;
}

export interface ServiceCursorPaginatedItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly service: Service;
  readonly cursor: IngestionOffsetCursor;
  readonly metrics: { [index: string]: number[][] };
}

export interface ServiceItem extends Metricific {
  readonly service: Service;
  readonly metrics: { [index: string]: number[][] };
}

export interface ServiceLabel {
  readonly id: string;
  readonly label: string;
}

export interface ServiceLink {
  readonly id: string;
  readonly label: string;
  readonly types: EndpointType[];
  readonly metrics: { [index: string]: number[][] };
}

export interface ServicePreviewItem {
  readonly id: string;
  readonly label: string;
}

export interface ServiceQueryConstants {}

export interface GetServiceMapQuery extends FilteredQuery {
  readonly filter: Filter;
}

export interface ServiceMapService extends Service {
  readonly maxSeverity: number;
  readonly numberOfOpenIssues: number;
  readonly applications: string[];
}

export interface ServiceMap {
  readonly services: ServiceMapService[];
  readonly connections: ServiceMapConnection[];
}

export interface ServiceMapConnection {
  readonly from: string;
  readonly to: string;
  readonly calls: number;
  readonly latency: number;
  readonly errorRate: number;
}

export interface AgentSnapshot extends Snapshot {
  readonly monitoringIssuesTotalCount: number;
  readonly monitoringIssuesCountByCategory?: { [index: string]: { [index: string]: number } };
}

export interface Snapshot {
  readonly timestamp: number;
  readonly from: number;
  readonly to?: number;
  readonly label?: string;
  readonly data?: { [index: string]: any };
  readonly dependencies?: Dependency[];
  readonly id?: string;
  readonly plugin?: string;
  readonly entityId?: EntityId;
  readonly volatileId?: VolatileId;
  readonly processorTags?: string[];
  readonly metricIds?: string[];
  readonly host_id?: string;
  readonly plugin_id?: string;
  readonly steady_id?: string;
  readonly volatile_id?: VolatileId;
  readonly processor_tags?: string[];
  readonly metric_ids?: string[];
}

export interface Builder {
  readonly label?: string;
  readonly hostId?: string;
  readonly pluginId?: string;
  readonly steadyId?: string;
  readonly sensorName?: string;
  readonly timestamp: number;
  readonly data?: any;
  readonly processorTags?: string[];
  readonly from: number;
  readonly to: number;
  readonly dependencies?: Dependency[];
  readonly metricIds?: string[];
  readonly id?: string;
  readonly this?: Builder;
  readonly volatileId?: VolatileId;
  readonly entityId?: EntityId;
  readonly snapshotId?: string;
}

export interface SnapshotPreview {
  readonly id: string;
  readonly time: number;
  readonly label?: string;
  readonly plugin?: string;
  readonly data?: { [index: string]: any };
}

export interface ApplicationAlertStats {
  readonly globalSmartAlerts: number;
  readonly smartAlerts: number;
}

export interface LegacyAlertStats {
  readonly customEvents: number;
  readonly legacyAlerts: number;
}

export interface WebsiteAlertStats {
  readonly websiteAlerts: number;
  readonly websites: number;
}

export interface GetQueryableTagsQuery extends UiQuery {
  readonly tenantConfig: TenantConfig;
  readonly timeConfig?: TimeConfig;
}

export interface GetTagSuggestionsQuery extends FilteredQuery {
  readonly filter: Filter;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagName: string;
  readonly secondLevelKeyTagName?: string;
  readonly entity: TagFilterEntity;
  readonly requestingSecondaryKeySuggestions: boolean;
  readonly valueFilter?: string;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly includeInternal?: boolean;
  readonly includeSynthetic?: boolean;
  readonly removeRequestedTagFromFilters?: boolean;
}

export interface QueryableTag {
  readonly name: string;
}

export interface Tag {
  readonly name?: string;
  readonly type?: TagType;
  readonly category?: string;
  readonly canApplyToSource: boolean;
  readonly canApplyToDestination: boolean;
  readonly sourceValueAvailableFrom: number;
}

export interface TagSuggestion {
  readonly label: string;
  readonly metrics: { [index: string]: number[][] };
}

export interface TagSuggestions {
  readonly totalHits: number;
  readonly suggestions: string[];
  readonly results: TagSuggestion[];
}

export interface GetTechnologyBreakdownQuery extends FilteredQuery {
  readonly filter: Filter;
  readonly breakdownType: BreakdownType;
  readonly granularity?: number;
}

export interface Call {
  readonly id: string;
  readonly label: string;
  readonly traceId: string;
  readonly service: Service;
  readonly duration: number;
  readonly errorCount: number;
  readonly batchCount: number;
  readonly started: number;
}

export interface CallGroupsItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly name: string;
  readonly timestamp: number;
  readonly cursor: IngestionOffsetCursor;
  readonly metrics: { [index: string]: number[][] };
}

export interface CallItem extends Cursorific<IngestionOffsetCursor> {
  readonly call: Call;
  readonly cursor: IngestionOffsetCursor;
}

export interface ContainsPastLiveDataQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
}

export interface FullTrace {
  readonly id: string;
  readonly totalErrorCount: number;
  readonly rootSpan: Span;
}

export interface GetCallGroupsQuery extends CursorPaginatedQuery, FilteredQuery, QueryWithPrecision, QueryWithMetrics {
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly filter: Filter;
  readonly metrics: { [index: string]: MetricConfiguration };
  /**
   * @deprecated
   */
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpressionElement?: TagFilterExpressionElement;
  readonly group: Group;
  readonly removeUnmatchedGroup: boolean;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly timeShift: TimeShift;
  readonly includeOthers: boolean;
  readonly expectedGroups?: string[];
}

export interface GetCallsQuery extends CursorPaginatedQuery, FilteredQuery, QueryWithPrecision {
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly filter: Filter;
  /**
   * @deprecated
   */
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpressionElement?: TagFilterExpressionElement;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface GetFullTraceQuery extends UiQuery {
  readonly id: string;
}

export interface GetRetentionQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
}

export interface GetSpanTreeNodeDetailsQuery extends UiQuery {
  readonly traceId?: string;
  readonly nodeId?: string;
}

export interface GetTraceActivityTreeQuery extends UiQuery {
  readonly id?: string;
}

export interface GetTraceGroupsQuery extends CursorPaginatedQuery, FilteredQuery, QueryWithPrecision {
  readonly pagination: CursorPagination<any>;
  readonly order: Order;
  readonly filter: Filter;
  readonly metrics: { [index: string]: MetricConfiguration };
  /**
   * @deprecated
   */
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpressionElement?: TagFilterExpressionElement;
  readonly group: Group;
  readonly removeUnmatchedGroup: boolean;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
}

export interface GetTraceParticipantsQuery extends PaginatedUIQuery {
  readonly traceId: string;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface GetTraceSummaryQuery extends FilteredQuery {
  readonly id: string;
  readonly filter?: Filter;
}

export interface GetTracesQuery extends CursorPaginatedQuery, FilteredQuery, QueryWithPrecision {
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly filter: Filter;
  /**
   * @deprecated
   */
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpressionElement?: TagFilterExpressionElement;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
}

export interface Span {
  readonly id: string;
  readonly parentId?: string;
  readonly foreignParentId?: string;
  readonly callId: string;
  readonly name: string;
  readonly label: string;
  readonly start: number;
  readonly duration: number;
  readonly calculatedSelfTime: number;
  readonly errorCount: number;
  readonly batchSize: number;
  readonly batchSelfTime?: number;
  readonly kind: SpanKind;
  readonly isSynthetic: boolean;
  readonly data: { [index: string]: any };
  readonly source?: SpanRelation;
  readonly destination?: SpanRelation;
  readonly stackTrace: StackTraceItem[];
  readonly childSpans: Span[];
}

export interface SpanExcerpt {
  readonly name: string;
  readonly kind: SpanKind;
  readonly foreignParentId?: string;
  readonly start: number;
  readonly duration: number;
  readonly errorCount: number;
  readonly stackTrace: StackTraceItem[];
  readonly data: { [index: string]: any };
}

export interface SpanRelation {
  readonly applications: Application[];
  readonly service?: Service;
  readonly endpoint?: Endpoint;
  readonly physicalContext?: PhysicalContext;
}

export interface StackTraceItem {
  readonly file?: string;
  readonly method?: string;
  readonly line?: string;
}

export interface Trace {
  readonly id: string;
  readonly label: string;
  readonly startTime: number;
  readonly duration: number;
  readonly erroneous: boolean;
  readonly service?: Service;
  readonly endpoint?: Endpoint;
}

export interface TraceActivityTreeNode {
  readonly id: string;
  readonly label: string;
  readonly start: number;
  readonly duration: number;
  readonly minSelfTime?: number;
  readonly networkTime?: number;
  readonly errorCount: number;
  readonly batchSize: number;
  readonly batchSelfTime?: number;
  readonly kind: string;
  readonly model: SpanModel;
  readonly service: Service;
  readonly endpoint: Endpoint;
  readonly children: TraceActivityTreeNode[];
}

export interface TraceActivityTreeNodeDetails {
  readonly id: string;
  readonly label: string;
  readonly start: number;
  readonly duration: number;
  readonly minSelfTime?: number;
  readonly networkTime?: number;
  readonly errorCount: number;
  readonly batchSize: number;
  readonly batchSelfTime?: number;
  readonly source?: SpanRelation;
  readonly destination?: SpanRelation;
  readonly spans: SpanExcerpt[];
  readonly logs: SpanExcerpt[];
  readonly synthetic: boolean;
  readonly isSynthetic: boolean;
}

export interface TraceGroupsItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly name: string;
  readonly timestamp: number;
  readonly cursor: IngestionOffsetCursor;
  readonly metrics: { [index: string]: number[][] };
}

export interface TraceItem extends Cursorific<IngestionOffsetCursor> {
  readonly trace: Trace;
  readonly cursor: IngestionOffsetCursor;
}

export interface TraceParticipant {
  readonly service: Service;
  readonly endpoint: Endpoint;
  readonly callCount: number;
  readonly aggregatedTime: number;
  readonly errorCount: number;
}

export interface TraceSummary {
  readonly id: string;
  readonly label: string;
  readonly type: EndpointType;
  readonly technologies: string[];
  readonly eumCorrelationId?: string;
  readonly eumCorrelationType?: string;
  readonly callCount: number;
  readonly callCountIgnoringBatchSize: number;
  readonly duration: number;
  readonly startTime: number;
  readonly totalErrorCount: number;
  readonly totalErrorLogCount: number;
  readonly totalWarnLogCount: number;
  readonly ingestionBatchesCount: number;
  readonly callRecordCount: number;
  readonly issues: string[];
}

export interface TraceViewedEvent extends UiQuery {
  readonly traceId: string;
}

export interface GetCallGroupsQueryBuilder {}

export interface GetTraceGroupsQueryBuilder {}

export interface GetTracesQueryBuilder {}

export interface GetWebsiteBeaconGroupsQueryBuilder {}

export interface GetWebsiteBeaconsQueryBuilder {}

export interface GetWebsiteMetricsQueryBuilder {}

export interface TreeMap {
  readonly root?: TreeMapNode<any>;
}

export interface TreeMapNode<T> {
  readonly id: string;
  readonly children?: TreeMapNode<any>[];
  readonly label?: string;
}

export interface ApplicationMetricConfiguration extends UnifiedMetricConfiguration {
  readonly dataSource: MetricDataSource;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly grouping?: Grouping[];
}

export interface DfqInfraMetricConfiguration extends UnifiedMetricConfiguration {
  readonly dynamicFocusQuery: string;
}

export interface DistributedLogsMetricConfiguration extends UnifiedMetricConfiguration {
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface DistributedLogsV2MetricConfiguration extends UnifiedMetricConfiguration {
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface EventMetricConfiguration extends UnifiedMetricConfiguration {
  readonly dynamicFocusQuery: string;
  readonly includeAgentMonitoringIssues: boolean;
  readonly includeK8sInfoEvents: boolean;
}

export interface EventMetricsCatalog {}

export interface GetUnifiedMetricsQuery {
  readonly metrics: { [index: string]: UnifiedMetricConfiguration };
  readonly rbacRestrictions?: any;
}

export interface Grouping {
  readonly by: Group;
  readonly metric?: string;
  readonly aggregation?: AggregationType;
  readonly maxResults: number;
  readonly direction: OrderDirection;
  readonly includeOthers: boolean;
  readonly includeUnmatched: boolean;
}

export interface InfraMetricConfiguration extends UnifiedMetricConfiguration {
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly grouping?: Grouping[];
  readonly type: string;
}

export interface LabeledMetricResult extends MetricResult {
  readonly label: string;
}

export interface UnifiedMetricConfiguration {
  readonly source: MetricSource;
  readonly metric: string;
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
  readonly resultType: ResultType;
  readonly granularity?: number;
  readonly aggregation: AggregationType;
}

export interface MetricResult {
  readonly id: string;
  readonly values?: number[][];
}

export interface MobileAppMetricConfiguration extends UnifiedMetricConfiguration {
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly beaconType?: string;
  readonly grouping?: Grouping[];
}

export interface SliMetricConfiguration extends UnifiedMetricConfiguration {
  readonly sliConfigId: string;
  readonly slo: number;
}

export interface UnsupportedMetricSource extends UnifiedMetricConfiguration {}

export interface UsageMetricConfiguration extends UnifiedMetricConfiguration {
  readonly showAggregatedMetrics: boolean;
  readonly tenant?: string;
  readonly unit?: string;
}

export interface WebsiteMetricConfiguration extends UnifiedMetricConfiguration {
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly beaconType?: string;
  readonly grouping?: Grouping[];
}

export interface GetVsphereDatacentersQuery extends PaginatedQuery {
  readonly filter: VsphereQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface GetVsphereHostsQuery extends PaginatedQuery {
  readonly filter: VsphereQueryFilter;
  readonly pagination: Pagination;
  readonly order: Order;
}

export interface VshphereDatacenterItem {
  readonly id: string;
  readonly datacenterId: string;
  readonly label: string;
  readonly name: string;
  readonly configStatus: string;
  readonly type: string;
  readonly overallStatus: string;
  readonly hosts: number;
  readonly vms: number;
  readonly entityHealthInfo?: EntityHealthInfo;
}

export interface VshphereHostItem {
  readonly id: string;
  readonly hostId: string;
  readonly label: string;
  readonly name: string;
  readonly overallStatus: string;
  readonly vms: number;
  readonly datastores?: VsphereDatastore[];
  readonly datacenterId?: string;
  readonly cpuTotal: number;
  readonly memoryTotal: number;
  readonly configStatus: number;
  readonly type: number;
}

export interface VshphereVmItem {
  readonly id: string;
  readonly hostId: string;
  readonly label: string;
  readonly guestFullName?: string;
  readonly guestState?: string;
  readonly cpuTotal: number;
  readonly memoryTotal: number;
  readonly configStatus: number;
  readonly type: number;
}

export interface VsphereDatacenterItemCounters extends FilterableListItem {
  readonly id: string;
  readonly datacenterId: string;
  readonly label: string;
  readonly hosts: number;
  readonly vms: number;
}

export interface VsphereDatastore {
  readonly id?: string;
  readonly label: string;
  readonly url?: string;
  readonly type?: string;
  readonly maxFileSize?: number;
  readonly freeSpace?: number;
  readonly capacity?: number;
}

export interface VsphereHost {
  readonly id: string;
  readonly label: string;
  readonly datacenterName: string;
  readonly cpuUsage?: number;
  readonly cpuAllocation?: number;
  readonly memoryUsage?: number;
  readonly memoryAllocation?: number;
  readonly datastores?: VsphereDatastore[];
}

export interface VsphereHostListItem extends FilterableListItem, ListItemWithMetric {
  readonly id: string;
  readonly label: string;
  readonly vms: number;
  readonly cpuTotal: number;
  readonly memTotal: number;
  readonly datacenterId?: string;
}

export interface VsphereInfrastructureLink extends FilterableListItem {
  readonly id: string;
  readonly label: string;
}

export interface VsphereVmListItem extends FilterableListItem, ListItemWithMetric {
  readonly id: string;
  readonly label: string;
  readonly cpuTotal: number;
  readonly memTotal: number;
  readonly guestFullName?: string;
  readonly datacenterId?: string;
  readonly hostId?: string;
}

export interface JavaScriptError {
  readonly id: string;
  readonly message: string;
  readonly errorType?: string;
  readonly stackTrace?: string;
  readonly componentStack?: string;
  readonly stackTraceParsingStatus: number;
  readonly parsedStackTrace?: StackTraceLine[];
}

export interface OperatingSystem {
  readonly name: string;
  readonly version?: string;
}

export interface WebBrowser {
  readonly name: string;
  readonly version?: string;
}

export interface Website {
  readonly id: string;
  readonly label: string;
}

export interface WebsiteMonitoringBeacon {
  readonly websiteId: string;
  readonly websiteLabel: string;
  readonly page?: string;
  readonly phase?: string;
  readonly timestamp?: number;
  readonly clockSkew?: number;
  readonly duration?: number;
  readonly batchSize?: number;
  readonly accurateTimingsAvailable?: boolean;
  readonly deprecations?: string[];
  readonly pageLoadId: string;
  readonly sessionId?: string;
  readonly beaconId: string;
  readonly backendTraceId?: string;
  readonly type: string;
  readonly customEventName?: string;
  readonly meta?: { [index: string]: string };
  readonly locationUrl: string;
  readonly locationOrigin: string;
  readonly locationPath?: string;
  readonly errorCount?: number;
  readonly errorMessage?: string;
  readonly errorId?: string;
  readonly errorType?: string;
  readonly stackTrace?: string;
  readonly stackTraceParsingStatus: number;
  readonly parsedStackTrace?: StackTraceLine[];
  readonly stackTraceReadability: number;
  readonly componentStack?: string;
  readonly userIp?: string;
  readonly userId?: string;
  readonly userName?: string;
  readonly userEmail?: string;
  readonly userLanguages?: string[];
  readonly deviceType?: string;
  readonly connectionType?: string;
  readonly browserName?: string;
  readonly browserVersion?: string;
  readonly osName?: string;
  readonly osVersion?: string;
  readonly windowHidden?: boolean;
  readonly windowWidth?: number;
  readonly windowHeight?: number;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly accuracyRadius?: number;
  readonly city?: string;
  readonly subdivision?: string;
  readonly subdivisionCode?: string;
  readonly country?: string;
  readonly countryCode?: string;
  readonly continent?: string;
  readonly continentCode?: string;
  readonly httpCallUrl?: string;
  readonly httpCallOrigin?: string;
  readonly httpCallPath?: string;
  readonly httpCallMethod?: string;
  readonly httpCallStatus?: number;
  readonly httpCallCorrelationAttempted?: boolean;
  readonly httpCallAsynchronous?: boolean;
  readonly initiator?: string;
  readonly resourceType?: string;
  readonly cacheInteraction?: string;
  readonly encodedBodySize?: number;
  readonly decodedBodySize?: number;
  readonly transferSize?: number;
  readonly unloadTime?: number;
  readonly redirectTime?: number;
  readonly appCacheTime?: number;
  readonly dnsTime?: number;
  readonly tcpTime?: number;
  readonly sslTime?: number;
  readonly requestTime?: number;
  readonly responseTime?: number;
  readonly processingTime?: number;
  readonly onLoadTime?: number;
  readonly backendTime?: number;
  readonly frontendTime?: number;
  readonly domTime?: number;
  readonly childrenTime?: number;
  readonly firstPaintTime?: number;
  readonly firstContentfulPaintTime?: number;
  readonly largestContentfulPaintTime: number;
  readonly firstInputDelayTime: number;
  readonly cumulativeLayoutShift: number;
  readonly cspBlockedUri?: string;
  readonly cspEffectiveDirective?: string;
  readonly cspOriginalPolicy?: string;
  readonly cspDisposition?: string;
  readonly cspSample?: string;
  readonly cspSourceFile?: string;
  readonly cspLineNumber?: number;
  readonly cspColumnNumber?: number;
  readonly snippetVersion?: string;
  readonly graphqlOperationName?: string;
  readonly graphqlOperationType?: string;
}

export interface GetDeprecationsQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface GetWebsiteAlertClustersQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly granularity: number;
  readonly websiteId: string;
  readonly page?: string;
  readonly rbacRestrictions?: any;
}

export interface GetWebsiteBeaconsForPageLoadQuery extends UiQuery {
  readonly pageLoadId: string;
  readonly beaconTimestamp?: number;
  readonly userId?: string;
  readonly rbacRestrictions?: any;
}

export interface GetWebsiteErrorQuery extends UiQuery {
  readonly errorId: string;
  readonly websiteId?: string;
  readonly timeConfig: TimeConfig;
  readonly rbacRestrictions?: any;
}

export interface GetWebsiteMetricAlertsPreviewQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly threshold: Threshold;
  readonly timeThreshold: WebsiteTimeThreshold;
  readonly granularity: number;
  readonly rbacRestrictions?: any;
}

export interface GetWebsiteMetricsQuery extends QueryWithMetrics, UiQuery {
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface GetWebsiteMetricsThresholdSuggestionQuery extends AbstractThresholdSuggestionQuery {
  readonly metric: WebsiteMonitoringMetricsConfiguration;
}

export interface GetWebsiteQuery extends UiQuery {
  readonly id: string;
  readonly rbacRestrictions?: any;
}

export interface GetWebsiteRateMetricAlertsPreviewQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly metrics: { [index: string]: WebsiteRateMetricConfiguration };
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly threshold: Threshold;
  readonly timeThreshold: WebsiteTimeThreshold;
  readonly granularity: number;
  readonly rbacRestrictions?: any;
}

export interface GetWebsiteRateMetricQuery extends QueryWithMetrics, UiQuery {
  readonly timeConfig: TimeConfig;
  readonly metrics: { [index: string]: WebsiteRateMetricConfiguration };
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface GetWebsiteRateMetricThresholdSuggestionQuery extends AbstractThresholdSuggestionQuery {
  readonly metric: WebsiteRateMetricConfiguration;
}

export interface GetWebsiteUniqueUsersInSlidingWindowQuery extends QueryWithMetrics, UiQuery {
  readonly timeConfig: TimeConfig;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly slidingWindowSize: number;
}

export interface WebsiteBeaconTagGroup extends Group {}

export interface WebsiteMonitoringMetricsConfiguration extends MetricConfiguration {}

export interface WebsiteRateMetricConfiguration extends WebsiteMonitoringMetricsConfiguration {
  readonly numeratorFilter?: TagFilter;
}

export interface BackendTrace {
  readonly traceId: string;
}

export interface GetEumBeaconBackendTracesQuery extends UiQuery {
  readonly correlationId: string;
}

export interface GetWebsiteBeaconGroupsQuery extends QueryWithMetrics, CursorPaginatedQuery {
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly group: WebsiteBeaconTagGroup;
  readonly includeOthers: boolean;
}

export interface WebsiteBeaconGroupsItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly name: string;
  readonly earliestTimestamp: number;
  readonly cursor: IngestionOffsetCursor;
  readonly metrics: { [index: string]: number[][] };
}

export interface GetWebsiteBeaconsQuery extends CursorPaginatedQuery {
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly order: Order;
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly rbacRestrictions?: any;
}

export interface WebsiteBeaconsItem extends Cursorific<IngestionOffsetCursor> {
  readonly beacon: WebsiteMonitoringBeacon;
  readonly cursor: IngestionOffsetCursor;
}

export interface GetWebsiteCountryBreakdownQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly rbacRestrictions?: any;
}

export interface WebsiteCountryBreakdown {
  readonly continent: string;
  readonly continentCode: string;
  readonly country: string;
  readonly countryCode: string;
  readonly pageLoads: number;
  readonly onLoadTime: number;
}

export interface GetWebsiteErrorsQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly rbacRestrictions?: any;
}

export interface WebsiteErrorsItem {
  readonly error: JavaScriptError;
  readonly metrics: { [index: string]: number[][] };
}

export interface GetWebsitePaginatedBeaconGroupsQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly group: WebsiteBeaconTagGroup;
  readonly rbacRestrictions?: any;
}

export interface WebsitePaginatedBeaconGroupsItem {
  readonly name: string;
  readonly earliestTimestamp: number;
  readonly metrics: { [index: string]: number[][] };
}

export interface GetWebsiteSubdivisionsQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly rbacRestrictions?: any;
}

export interface WebsiteSubdivisionsItem {
  readonly continent: string;
  readonly continentCode: string;
  readonly country: string;
  readonly countryCode: string;
  readonly subdivision: string;
  readonly subdivisionCode?: string;
  readonly metrics: { [index: string]: number[][] };
}

export interface GetWebsiteWebBrowsersQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly rbacRestrictions?: any;
}

export interface WebsiteWebBrowsersItem {
  readonly webBrowser: WebBrowser;
  readonly metrics: { [index: string]: number[][] };
}

export interface GetWebsitesQuery extends PaginatedUIQuery {
  readonly timeConfig: TimeConfig;
  readonly labelFilter?: string;
  readonly pagination: Pagination;
  readonly order: Order;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly rbacRestrictions?: any;
}

export interface WebsiteItem {
  readonly website: Website;
  readonly metrics: { [index: string]: number[][] };
  readonly healthInfo?: EntityHealthInfo;
}

export interface GetWindowWidthBreakdownQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
  readonly windowWidths: number[];
  readonly tagFilters?: TagFilter[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly rbacRestrictions?: any;
}

export interface WindowWidthBreakdown {
  readonly minWindowWidth: number;
  readonly maxWindowWidth: number;
  readonly pageLoads: number;
  readonly users: number;
}

export interface Threshold {
  readonly type: string;
  readonly operator: ThresholdOperator;
}

export interface TagFilterExpressionElement {
  readonly type: string;
}

export interface ApplicationTimeThreshold extends TimeThreshold {
  readonly type: string;
}

export interface ApplicationAlertRule extends AlertRule {
  readonly alertType: string;
}

export interface TagFilter extends TagFilterExpressionElement {
  readonly name: string;
  readonly stringValue?: string;
  readonly numberValue?: number;
  readonly booleanValue?: boolean;
  readonly key?: string;
  readonly value?: any;
  readonly operator: TagFilterOperator;
  readonly entity: TagFilterEntity;
}

export interface Timeframe {
  readonly windowSize: number;
  readonly to?: number;
  readonly from: number;
  readonly toAsDate?: Date;
  readonly fromAsDate?: Date;
  readonly toOrNow: number;
}

export interface TagFilterExpression extends TagFilterExpressionElement {
  readonly logicalOperator: LogicalOperator;
  readonly elements: TagFilterExpressionElement[];
}

export interface EntityId extends Comparable<EntityId> {
  readonly host: string;
  readonly pluginId: string;
  readonly steadyId: string;
}

export interface Comparator<T> {}

export interface LoggingLogTag {
  readonly name?: string;
  readonly label?: string;
}

export interface MobileAppMonitoringBeacon {
  readonly tenant?: string;
  readonly unit?: string;
  readonly environment?: string;
  readonly region?: string;
  readonly agentVersion?: string;
  readonly mobileAppId: string;
  readonly mobileAppLabel?: string;
  readonly timestamp: number;
  readonly clockSkew: number;
  readonly ingestionTime: number;
  readonly duration: number;
  readonly batchSize: number;
  readonly sessionId: string;
  readonly beaconId: string;
  readonly backendTraceId?: string;
  readonly type: string;
  readonly view?: string;
  readonly customEventName?: string;
  readonly meta?: { [index: string]: string };
  readonly userIp?: string;
  readonly userId?: string;
  readonly userName?: string;
  readonly userEmail?: string;
  readonly userLanguages?: string[];
  readonly bundleIdentifier?: string;
  readonly appBuild?: string;
  readonly appVersion?: string;
  readonly platform?: string;
  readonly osName?: string;
  readonly osVersion?: string;
  readonly deviceManufacturer?: string;
  readonly deviceModel?: string;
  readonly deviceHardware?: string;
  readonly rooted: boolean;
  readonly googlePlayServicesMissing: boolean;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly carrier?: string;
  readonly connectionType?: string;
  readonly effectiveConnectionType?: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly accuracyRadius: number;
  readonly city?: string;
  readonly subdivision?: string;
  readonly subdivisionCode?: string;
  readonly country?: string;
  readonly countryCode?: string;
  readonly continent?: string;
  readonly continentCode?: string;
  readonly httpCallUrl?: string;
  readonly httpCallOrigin?: string;
  readonly httpCallPath?: string;
  readonly httpCallMethod?: string;
  readonly httpCallStatus: number;
  readonly encodedBodySize: number;
  readonly decodedBodySize: number;
  readonly transferSize: number;
  readonly errorCount: number;
  readonly errorMessage?: string;
  readonly errorId?: string;
  readonly errorType?: string;
  readonly stackTrace?: string;
}

export interface VolatileId {
  readonly host_id?: string;
  readonly sensor_name?: string;
  readonly entity_id?: string;
}

export interface Dependency {
  readonly direction?: string;
  readonly type?: string;
  readonly key?: string;
}

export interface TenantConfig {
  readonly tenant?: string;
  readonly unit?: string;
  readonly environment?: string;
}

export interface StackTraceLine {
  readonly file: string;
  readonly name?: string;
  readonly line: number;
  readonly column: number;
  readonly translationStatus: number;
  readonly translationExplanation?: string;
}

export interface WebsiteTimeThreshold extends TimeThreshold {
  readonly type: string;
}

export interface StaticThreshold extends Threshold {
  readonly value: number;
  readonly lastUpdated: number;
}

export interface HistoricBaseline extends Threshold {
  readonly seasonality: Seasonality;
  readonly baseline?: number[][];
  readonly deviationFactor: number;
  readonly lastUpdated: number;
}

export interface AdaptiveBaseline extends Threshold {
  readonly deviationFactor: number;
}

export interface ViolationsInSequenceApplicationTimeThreshold extends ApplicationTimeThreshold {}

export interface ViolationsInPeriodApplicationTimeThreshold extends ApplicationTimeThreshold {
  readonly violations: number;
}

export interface RequestImpactApplicationTimeThreshold extends ApplicationTimeThreshold {
  readonly requests: number;
}

export interface TimeThreshold {
  readonly timeWindow: number;
}

export interface SlownessApplicationAlertRule extends ApplicationAlertRule {
  readonly aggregation: AggregationType;
}

export interface ErrorRateApplicationAlertRule extends ApplicationAlertRule {}

export interface LogsApplicationAlertRule extends ApplicationAlertRule {
  readonly operator: TagFilterOperator;
  readonly message?: string;
  readonly level: LogsApplicationAlertRuleLogLevel;
  readonly loglevel?: LogsApplicationAlertRuleLogLevel;
}

export interface StatusCodeApplicationAlertRule extends ApplicationAlertRule {
  readonly statusCodeStart: number;
  readonly statusCodeEnd: number;
}

export interface ThroughputApplicationAlertRule extends ApplicationAlertRule {}

export interface AlertRule {
  readonly metricName: string;
  readonly aggregation?: AggregationType;
}

export interface ViolationsInSequenceWebsiteTimeThreshold extends WebsiteTimeThreshold {}

export interface ViolationsInPeriodWebsiteTimeThreshold extends WebsiteTimeThreshold {
  readonly violations: number;
}

export interface UserImpactWebsiteTimeThreshold extends WebsiteTimeThreshold, UserImpactThreshold {}

export interface Comparable<T> {}

export interface UserImpactThreshold {
  readonly userPercentage?: number;
  readonly users?: number;
}

export type ApplicationBoundaryScope = 'ALL' | 'INBOUND';

export type ApplicationDownstreamScope =
  | 'INCLUDE_NO_DOWNSTREAM'
  | 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING'
  | 'INCLUDE_ALL_DOWNSTREAM';

export type Level = 'APP' | 'APP_SERVICE' | 'APP_SERVICE_ENDPOINT';

export type Type = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'UNKNOWN';

export type EndpointSyntheticType = 'NON_SYNTHETIC' | 'SYNTHETIC' | 'MIXED';

export type EndpointType =
  | 'UNDEFINED'
  | 'RPC'
  | 'EVENT'
  | 'GRAPHQL'
  | 'BATCH'
  | 'SHELL'
  | 'HTTP'
  | 'SDK'
  | 'OPENTELEMETRY'
  | 'INTERNAL'
  | 'DATABASE'
  | 'MESSAGING'
  | 'PAGE'
  | 'PAGE_RESOURCE';

export type LogLevel = 'WARN' | 'ERROR';

export type QueryPrecision = 'APPROXIMATE' | 'FULL';

export type UiEntityType = 'APPLICATION' | 'SERVICE' | 'ENDPOINT';

export type ErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'AUTH'
  | 'TOO_MANY_REQUESTS'
  | 'CLIENT'
  | 'SERVER'
  | 'UNAVAILABLE'
  | 'GATEWAY_TIMEOUT'
  | 'TIMEOUT';

export type AgentMonitoringIssueCategory = 'SENSOR' | 'TRACER' | 'PROFILER' | 'UNKNOWN';

export type EventTypes = 'INCIDENT' | 'ISSUE' | 'CHANGE' | 'OBJECTIVE' | 'AGENT_MONITORING_ISSUE';

export type FlowDirection = 'INCOMING' | 'OUTGOING';

export type InfraTabCategory = 'HOST' | 'CONTAINER' | 'PROCESS' | 'CLUSTER';

export type KubernetesClusterManagementType = 'RANCHER' | 'PKS' | 'NONE';

export type DataSource = 'CALLS' | 'TRACES';

export type MetricDataSource = 'CALLS' | 'TRACES';

export type OrderDirection = 'ASC' | 'DESC';

export type KubernetesTreemapGrouping = 'DEPLOYMENT' | 'NAMESPACE' | 'SERVICE' | 'NODE';

export type ContextScope = 'NONE' | 'UPSTREAM' | 'DOWNSTREAM';

export type TagSuggestionProposeType = 'KEYS' | 'VALUES';

export type TagType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'KEY_VALUE_PAIR';

export type BreakdownType = 'RESPONSE_TIME' | 'PROCESSING_TIME';

export type SpanKind = 'UNKNOWN' | 'ENTRY' | 'EXIT' | 'INTERMEDIATE';

export type SpanModel = 'UNKNOWN' | 'HTTP' | 'DATABASE' | 'RPC' | 'MESSAGING' | 'BATCH' | 'LOG' | 'SDK';

export type MetricSource =
  | 'INFRASTRUCTURE_METRICS'
  | 'INFRASTRUCTURE'
  | 'APPLICATION'
  | 'WEBSITE'
  | 'MOBILE_APP'
  | 'EVENT'
  | 'SLI'
  | 'USAGE'
  | 'DISTRIBUTED_LOGS'
  | 'DISTRIBUTED_LOGS_V2'
  | 'UNKNOWN';

export type ResultType = 'TIME_SERIES' | 'HISTOGRAM' | 'SINGLE_NUMBER';

export type SliMetricType =
  | 'SLI'
  | 'ERROR_BUDGET_SPENT'
  | 'ERROR_BUDGET_REMAINING'
  | 'TOTAL_ERROR_BUDGET'
  | 'HOURLY_ERROR_BUDGET_CHART'
  | 'CONSUMED_ERROR_BUDGET_CHART';

export type ThresholdType = 'staticThreshold' | 'historicBaseline' | 'adaptiveBaseline';

export type ThresholdOperator = '>' | '>=' | '<' | '<=';

export type Seasonality = 'WEEKLY' | 'DAILY';

export type AlertEvaluationType = 'PER_AP' | 'PER_AP_SERVICE' | 'PER_AP_ENDPOINT';

export type Granularity = 60000 | 300000 | 600000 | 900000 | 1200000 | 1800000;

export type Relationship =
  | 'CONTAINS'
  | 'DEFINED_IN'
  | 'DEPLOYED_ON'
  | 'DEPLOYED_WITHIN'
  | 'EXECUTED_BY'
  | 'EXECUTING'
  | 'EXPOSED_BY'
  | 'EXPOSED_THROUGH'
  | 'EXPOSES'
  | 'EXPOSING'
  | 'ORCHESTRATED_IN'
  | 'ORCHESTRATED_ON'
  | 'ORCHESTRATING'
  | 'PART_OF'
  | 'PROVIDED_BY'
  | 'PROVIDED_FROM'
  | 'PROVIDED_ON'
  | 'PROVIDED_WITHIN'
  | 'PROVIDES'
  | 'RUNS'
  | 'RUNS_IN'
  | 'RUNS_ON'
  | 'RUNS_WITHIN'
  | 'SCHEDULED'
  | 'SCHEDULED_BY'
  | 'SCHEDULED_ON'
  | 'SCHEDULED_WITHIN'
  | 'SCHEDULES'
  | 'SCHEDULING_IN'
  | 'SCHEDULING_ON'
  | 'SERVED_BY'
  | 'SERVED_THROUGH'
  | 'SERVES'
  | 'SERVES_ON'
  | 'SERVES_WITHIN'
  | 'SPANS_ACROSS'
  | 'WITHIN';

export type EntityContextGuideGroup =
  | 'INFRASTRUCTURE_AVAILABILITY_ZONE'
  | 'INFRASTRUCTURE_CLUSTER'
  | 'INFRASTRUCTURE_CLUSTER_NODE'
  | 'INFRASTRUCTURE_HARDWARE'
  | 'INFRASTRUCTURE_HOST'
  | 'INFRASTRUCTURE_CONTAINER'
  | 'INFRASTRUCTURE_PROCESS'
  | 'INFRASTRUCTURE_PROCESS_TECHNOLOGY'
  | 'INFRASTRUCTURE_PROCESS_APPLICATION'
  | 'APPLICATION_PERSPECTIVE'
  | 'APPLICATION_SERVICE'
  | 'APPLICATION_ENDPOINT'
  | 'KUBERNETES_CLUSTER'
  | 'KUBERNETES_NODE'
  | 'KUBERNETES_NAMESPACE'
  | 'KUBERNETES_WORKLOAD_CONTROLLER'
  | 'KUBERNETES_SERVICE'
  | 'KUBERNETES_POD'
  | 'KUBERNETES_REPLICA_SET'
  | 'KUBERNETES_ENDPOINTS'
  | 'KUBERNETES_JOB'
  | 'KUBERNETES_CRONJOB';

export type AggregationType =
  | 'SUM'
  | 'MEAN'
  | 'MAX'
  | 'MIN'
  | 'P25'
  | 'P50'
  | 'P75'
  | 'P90'
  | 'P95'
  | 'P98'
  | 'P99'
  | 'P99_9'
  | 'P99_99'
  | 'DISTINCT_COUNT'
  | 'SUM_POSITIVE';

export type EntityType = 'Entity10' | 'App20' | 'Service20' | 'Endpoint20' | 'Website';

export type InfraTagCategory =
  | 'OTHERS'
  | 'KUBERNETES'
  | 'CLOUD_FOUNDRY'
  | 'VSHPERE'
  | 'AWS'
  | 'AZURE'
  | 'GCP'
  | 'CONTAINER'
  | 'SELF_MONITORING'
  | 'IBM_CLOUD'
  | 'IBM_DATAPOWER'
  | 'IBM_I_SERIES'
  | 'IBM_MQ'
  | 'CLR'
  | 'ACE'
  | 'CASSANDRA'
  | 'COCKROACH'
  | 'CONSUL'
  | 'COUCHBASE'
  | 'ELASTICSEARCH'
  | 'HADOOP_YARN'
  | 'HAZELCAST'
  | 'KAFKA_CONNECT'
  | 'MONGO_DB'
  | 'REDIS'
  | 'SOLR'
  | 'SPARK';

export type Formatter =
  | 'NUMBER'
  | 'BYTES'
  | 'PERCENTAGE'
  | 'LATENCY'
  | 'MILLIS'
  | 'SECONDS'
  | 'MICROS'
  | 'RATE'
  | 'BYTE_RATE'
  | 'UNDEFINED';

export type TagFilterEntity = 'NOT_APPLICABLE' | 'DESTINATION' | 'SOURCE';

export type TagFilterOperator =
  | 'EQUALS'
  | 'CONTAINS'
  | 'LESS_THAN'
  | 'LESS_OR_EQUAL_THAN'
  | 'GREATER_THAN'
  | 'GREATER_OR_EQUAL_THAN'
  | 'NOT_EMPTY'
  | 'NOT_EQUAL'
  | 'NOT_CONTAIN'
  | 'IS_EMPTY'
  | 'NOT_BLANK'
  | 'IS_BLANK'
  | 'STARTS_WITH'
  | 'ENDS_WITH'
  | 'NOT_STARTS_WITH'
  | 'NOT_ENDS_WITH';

export type LogicalOperator = 'AND' | 'OR';

export type LogsApplicationAlertRuleLogLevel = 'WARN' | 'ERROR' | 'ANY';
