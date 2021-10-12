/* tslint:disable */
/* eslint-disable */

import { TimeConfig, TagType } from 'in-types/backendCorrections';

export interface AbstractApplicationAlertConfig {
  readonly alertChannelIds: string[];
  readonly boundaryScope: AlertingApplicationBoundaryScope;
  readonly customPayloadFields: StaticStringField[];
  readonly description: string;
  readonly evaluationType: AlertEvaluationType;
  readonly granularity?: Granularity;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly name: string;
  readonly rule: ApplicationAlertRule;
  readonly severity: number;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly threshold: ThresholdConfig;
  readonly timeThreshold: ApplicationTimeThreshold;
  readonly triggering: boolean;
}

export interface AbstractKubernetesContainerState {
  readonly running: boolean;
  readonly status?: string;
  readonly terminated: boolean;
  readonly waiting: boolean;
}

export interface AbstractRule {
  readonly ruleType: string;
  readonly severity: number;
}

export interface AbstractThresholdSuggestionQuery extends ThresholdSuggestionQuery, UiQuery {
  readonly operator: ThresholdOperator;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly type: ThresholdType;
}

export interface AccessRule {
  readonly accessType: AccessType;
  readonly relatedId?: string;
  readonly relationType: AccessRuleRelationType;
}

export interface AdaptiveBaselineConfig extends ThresholdConfig {
  readonly deviationFactor: number;
}

export interface AdaptiveBaselineData extends ThresholdData {
  readonly baseline: number[][];
  readonly deviationFactor: number;
}

export interface AdaptiveBaselineSuggestionResponse extends ThresholdSuggestionResponse {
  readonly baseline: number[][];
  readonly message?: string;
}

export interface AgentMonitoringIssueWithSnapshot {
  readonly affectedEntityId: string;
  readonly affectedEntitySnapshot?: SnapshotPreview;
  readonly agentMonitoringArguments?: { [index: string]: any };
  readonly agentMonitoringCategory: string;
  readonly agentMonitoringCode: string;
  readonly end?: number;
  readonly id: string;
  readonly start: number;
  readonly triggeringTime: number;
}

export interface AgentSnapshot extends Snapshot {
  readonly monitoringIssuesCountByCategory?: { [index: string]: { [index: string]: number } };
  readonly monitoringIssuesTotalCount: number;
}

export interface Alert {
  readonly end: number;
  readonly key?: string;
  readonly start: number;
}

export interface AlertClusterResponse {
  readonly incidents: AlertResponse[];
  readonly smartAlerts: AlertResponse[];
  readonly timestamp: number;
}

export interface AlertResponse extends Comparable<AlertResponse> {
  readonly adjustedStart?: number;
  readonly adjustedTriggeringTime?: number;
  readonly duration?: number;
  readonly end?: number;
  readonly eventId: string;
  readonly name: string;
  readonly start: number;
  readonly triggeringTime: number;
}

export interface AlertRule {
  readonly aggregation?: AggregationType;
  readonly metricName: string;
}

export interface AlertRuleWithGranularity {
  readonly granularity: Granularity;
  readonly operator: ThresholdOperator;
  readonly rule: ApplicationAlertRule;
  readonly seasonality?: Seasonality;
  readonly timeThreshold: ApplicationTimeThreshold;
}

export interface AlertingChannelInputInfo {
  readonly enabled: boolean;
  readonly entityId?: string;
  readonly eventTypes?: AlertingEventTypes[];
  readonly id: string;
  readonly label: string;
  readonly query?: string;
  readonly selectedEvents?: number;
  readonly type: AlertType;
}

export interface AlertingConfiguration {
  readonly alertName: string;
  readonly customPayloadFields: StaticStringField[];
  readonly eventFilteringConfiguration: EventFilteringConfiguration;
  readonly id: string;
  readonly integrationIds: string[];
  readonly muteUntil: number;
}

export interface AlertingConfigurationWithLastUpdated extends AlertingConfiguration {
  readonly lastUpdated: number;
}

export interface ApiTag {
  readonly canApplyToDestination: boolean;
  readonly canApplyToSource: boolean;
  readonly description?: string;
  readonly label?: string;
  readonly name: string;
  readonly type: TagType;
}

export interface ApiToken {
  readonly id: string;
  readonly name: string;
}

export interface AppDataEntityChain extends Cursorific<IngestionOffsetCursor> {
  readonly applicationId: string;
  readonly applicationName: string;
  readonly cursor: IngestionOffsetCursor;
  readonly endpointId?: string;
  readonly endpointName?: string;
  readonly endpointType?: EndpointType;
  readonly serviceId?: string;
  readonly serviceName?: string;
}

export interface AppDataEntityChainItem extends Cursorific<IngestionOffsetCursor> {
  readonly appDataEntityChain: AppDataEntityChain;
  readonly cursor: IngestionOffsetCursor;
}

export interface AppDataMetricConfiguration extends MetricConfiguration {
}

export interface Application {
  readonly boundaryScope: string;
  readonly entityType?: UiEntityType;
  readonly id: string;
  readonly label: string;
}

export interface ApplicationAlertConfig extends AbstractApplicationAlertConfig {
  readonly applicationId?: string;
  readonly applications: { [index: string]: ApplicationNode };
}

export interface ApplicationAlertConfigMigrationItem {
  readonly applicationAlertConfig?: ApplicationAlertConfig;
  readonly globalApplicationsAlertConfig?: GlobalApplicationsAlertConfig;
  readonly globalSmartAlert: boolean;
}

export interface ApplicationAlertConfigWithMetadata extends ApplicationAlertConfig, VersionedConfig {
  readonly derivedFromGlobalAlert: boolean;
  readonly id: string;
}

export interface ApplicationAlertRule extends AlertRule {
  readonly alertType: string;
}

export interface ApplicationAlertStats {
  readonly globalSmartAlerts: number;
  readonly smartAlerts: number;
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

export interface ApplicationMetricConfiguration extends UnifiedMetricConfiguration {
  readonly dataSource: MetricDataSource;
  readonly grouping?: Grouping[];
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
}

export interface ApplicationNode {
  readonly applicationId: string;
  readonly inclusive: boolean;
  readonly services: { [index: string]: ServiceNode };
}

export interface ApplicationScope {
  readonly name: string;
}

export interface ApplicationScopeWithId {
  readonly id: string;
  readonly name?: string;
}

export interface ApplicationSliEntity extends SliEntity {
  readonly applicationId: string;
  readonly boundaryScope: AlertingApplicationBoundaryScope;
  readonly endpointId?: string;
  readonly serviceId?: string;
}

export interface ApplicationTimeThreshold extends TimeThreshold {
  readonly type: string;
}

export interface AvailabilitySliEntity extends SliEntity {
  readonly applicationId: string;
  readonly badEventFilterExpression?: TagFilterExpressionElement;
  readonly badEventFilters?: TagFilter[];
  readonly boundaryScope: AlertingApplicationBoundaryScope;
  readonly endpointId?: string;
  readonly goodEventFilterExpression?: TagFilterExpressionElement;
  readonly goodEventFilters?: TagFilter[];
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly serviceId?: string;
}

export interface AvailableMetrics {
  readonly metrics?: MetricMetadata[];
}

export interface AvailablePlugins {
  readonly plugins?: string[];
}

export interface BackendTrace {
  readonly traceId: string;
}

export interface Builder {
  readonly data?: any;
  readonly dependencies?: Dependency[];
  readonly entityId?: EntityId;
  readonly from: number;
  readonly hostId?: string;
  readonly id?: string;
  readonly label?: string;
  readonly metricIds?: string[];
  readonly pluginId?: string;
  readonly processorTags?: string[];
  readonly sensorName?: string;
  readonly snapshotId?: string;
  readonly steadyId?: string;
  readonly this?: Builder;
  readonly timestamp: number;
  readonly to: number;
  readonly volatileId?: VolatileId;
}

export interface Call {
  readonly batchCount: number;
  readonly duration: number;
  readonly errorCount: number;
  readonly id: string;
  readonly label: string;
  readonly service: Service;
  readonly started: number;
  readonly traceId: string;
}

export interface CallGroupsItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly metrics: { [index: string]: number[][] };
  readonly name: string;
  readonly timestamp: number;
}

export interface CallItem extends Cursorific<IngestionOffsetCursor> {
  readonly call: Call;
  readonly cursor: IngestionOffsetCursor;
}

export interface CloudfoundryApplication {
  readonly buildpack?: string;
  readonly createdAt?: number;
  readonly diskLimit?: number;
  readonly foundation?: string;
  readonly guid: string;
  readonly id: string;
  readonly label: string;
  readonly lastUpdated?: number;
  readonly memoryLimit?: number;
  readonly organization?: string;
  readonly routes: string[];
  readonly space?: string;
  readonly status?: string;
}

export interface CloudfoundryApplicationLink {
  readonly entityHealthInfo?: EntityHealthInfo;
  readonly guid: string;
  readonly healthInfo?: EntityHealthInfo;
  readonly name: string;
  readonly organization: string;
  readonly snapshotId: string;
  readonly space: string;
}

export interface CloudfoundryApplicationListItem extends FilterableListItem {
  readonly entityHealthInfo: EntityHealthInfo;
  readonly foundation?: string;
  readonly id: string;
  readonly label: string;
  readonly memoryLimit?: number;
  readonly organization?: string;
  readonly routes: string[];
  readonly space?: string;
  readonly status: string;
}

export interface CloudfoundryContainer {
  readonly cfInstanceIndex?: string;
  readonly id: string;
  readonly label: string;
  readonly plugin: string;
}

export interface CloudfoundryContainerListItem extends FilterableListItem {
  readonly cfInstanceIndex?: string;
  readonly container: CloudfoundryContainer;
  readonly containerLabel?: string;
  readonly entityHealthInfo: EntityHealthInfo;
}

export interface CloudfoundryPhysicalContext {
  readonly application?: SnapshotPreview;
  readonly cfInstanceIndex?: string;
  readonly organization?: SnapshotPreview;
  readonly space?: SnapshotPreview;
}

export interface CloudfoundryQueryFilter extends FilterInterface {
  readonly applicationId?: string;
  readonly containerId?: string;
  readonly label?: string;
  readonly timeConfig: TimeConfig;
}

export interface Comparable<T> {
}

export interface Comparator<T> {
}

export interface ComponentStatus {
  readonly conditionMessage?: string;
  readonly conditionStatus?: string;
  readonly name: string;
}

export interface ConfigKey {
  readonly created: number;
  readonly entityId?: string;
  readonly id?: string;
  readonly tenantKey?: string;
}

export interface ConfigVersion {
  readonly created: number;
  readonly deleted: boolean;
  readonly enabled: boolean;
  readonly id: string;
}

export interface ContainsPastLiveDataQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
}

export interface ContextGuideGroup {
  readonly itemCount: number;
  readonly items: Item[];
  readonly relationship: Relationship;
  readonly type: string;
}

export interface Cursor {
}

export interface CursorPaginatedQuery extends UiQuery {
  readonly pagination?: CursorPagination<any>;
}

export interface CursorPaginatedResult<ITEM> {
  readonly canLoadMore: boolean;
  readonly items: ITEM[];
  readonly totalHits: number;
  readonly totalRepresentedItemCount: number;
}

export interface CursorPaginatedWithNext<ITEM, CURSOR> {
  readonly canLoadMore: boolean;
  readonly items: ITEM[];
  readonly next?: CURSOR;
  readonly totalHits: number;
  readonly totalRepresentedItemCount: number;
}

export interface CursorPagination<CURSOR_TYPE> {
  readonly cursor?: CURSOR_TYPE;
  readonly retrievalSize: number;
}

export interface CursoredEvent extends Event, Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
}

export interface Cursorific<T> {
  readonly cursor?: T;
}

export interface CustomAbstractEventSpecification<T> {
  readonly description?: string;
  readonly enabled: boolean;
  readonly entityType: string;
  readonly expirationTime: number;
  readonly id: string;
  readonly name: string;
  readonly query?: string;
  readonly rules: T[];
  readonly triggering: boolean;
  readonly validVersion: number;
}

export interface CustomDashboard {
  readonly accessRules: AccessRule[];
  readonly id: string;
  readonly title: string;
  readonly widgets: Widget[];
}

export interface CustomDashboardPreview {
  readonly id: string;
  readonly title: string;
}

export interface CustomEventSpecification extends CustomAbstractEventSpecification<AbstractRule> {
  readonly rules: AbstractRule[];
}

export interface CustomEventSpecificationWithLastUpdated extends CustomEventSpecification {
  readonly lastUpdated: number;
}

export interface CustomPayloadConfiguration {
  readonly fields: CustomPayloadField[];
}

export interface CustomPayloadConfigurationWithLastUpdated extends CustomPayloadConfiguration {
  readonly lastUpdated: number;
}

export interface CustomPayloadField {
  readonly key: string;
  readonly type: string;
}

export interface DatabaseStatementTopListItem {
  readonly id: string;
  readonly metricValue: number;
  readonly statement: string;
}

export interface DefaultComparator extends Comparator<any> {
}

export interface Dependency {
  readonly direction?: Direction;
  readonly key?: string;
  readonly type?: DependencyType;
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

export interface DomainSpecificStack {
  readonly groups: ContextGuideGroup[];
  readonly healthInfo?: HealthInfo;
}

export interface DomainSpecificStackBuilder {
}

export interface DynamicField extends CustomPayloadField {
  readonly value: DynamicFieldValue;
}

export interface DynamicFieldValue {
  readonly key?: string;
  readonly tagName: string;
}

export interface Endpoint {
  readonly entityType?: UiEntityType;
  readonly id: string;
  readonly isSynthetic?: boolean;
  readonly label: string;
  readonly serviceId: string;
  readonly synthetic?: boolean;
  readonly syntheticType?: EndpointSyntheticType;
  readonly technologies: string[];
  readonly type: EndpointType;
}

export interface EndpointCursorPaginatedItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly endpoint: Endpoint;
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

export interface EndpointNode {
  readonly endpointId: string;
  readonly inclusive: boolean;
}

export interface EndpointPathSegment {
  readonly endpoint: string;
  readonly service: string;
}

export interface EndpointPreview {
  readonly label: string;
}

export interface EndpointQueryConstants {
}

export interface EndpointTypeSummary {
  readonly metrics: { [index: string]: number[][] };
  readonly type: EndpointType;
}

export interface EntityHealthInfo {
  readonly maxSeverity: number;
  readonly openIssues: Event[];
}

export interface EntityHealthInfoComparator extends Comparator<EntityHealthInfo> {
}

export interface EntityId extends Comparable<EntityId> {
  readonly host: string;
  readonly pluginId: string;
  readonly steadyId: string;
}

export interface EntityVerificationRule extends AbstractRule {
  readonly matchingEntityLabel: string;
  readonly matchingEntityType: string;
  readonly matchingOperator: AlertingStringMatchingOperator;
  readonly offlineDuration: number;
}

export interface Error {
  readonly code: ErrorCode;
  readonly message: string;
}

export interface ErrorMessageItem {
  readonly message: string;
  readonly metrics: { [index: string]: number[][] };
}

export interface ErrorRateApplicationAlertRule extends ApplicationAlertRule {
}

export interface Event {
  readonly end?: number;
  readonly endpointServiceId?: string;
  readonly entityId: string;
  readonly entityType?: EntityType;
  readonly id: string;
  readonly metadata?: { [index: string]: any };
  readonly metricAccessId?: string;
  readonly problem?: Problem;
  readonly start: number;
  readonly state: string;
  readonly triggeringTime: number;
  readonly type: string;
}

export interface EventFilteringConfiguration {
  readonly applicationAlertConfigIds?: string[];
  readonly eventTypes?: AlertingEventTypes[];
  readonly query?: string;
  readonly ruleIds?: string[];
}

export interface EventMetricConfiguration extends UnifiedMetricConfiguration {
  readonly dynamicFocusQuery: string;
  readonly includeAgentMonitoringIssues: boolean;
  readonly includeK8sInfoEvents: boolean;
}

export interface EventMetricsCatalog {
}

export interface EventSpecificationDetails {
  readonly description?: string;
  readonly expirationTime: number;
  readonly severity: number;
  readonly text: string;
  readonly triggering: boolean;
}

export interface EventSpecificationInfo {
  readonly description?: string;
  readonly enabled: boolean;
  readonly entityType: string;
  readonly id: string;
  readonly invalid: boolean;
  readonly name: string;
  readonly severity: number;
  readonly triggering: boolean;
  readonly type: EventSpecificationType;
}

export interface EventSpecificationMatch {
  readonly entityType: string;
  readonly excludedSnapshotIds?: string[];
  readonly metricName: string;
  readonly query?: string;
  readonly queryEvaluationTimestamp?: number;
  readonly rollup: number;
}

export interface ExtendedMetricsTimeConfig extends TimeConfig {
  readonly autoRefresh: boolean;
  readonly focusedMoment?: number;
  readonly to?: number;
  readonly windowSize: number;
}

export interface Fields {
}

export interface Filter extends FilterInterface {
  readonly application?: string;
  readonly applicationBoundaryScope?: ApplicationBoundaryScope;
  readonly endpoint?: string;
  readonly endpointName?: string;
  readonly endpointTypes?: EndpointType[];
  readonly includeInternalCalls: boolean;
  readonly includeSyntheticCalls: boolean;
  readonly label?: string;
  readonly processReference?: EntityId;
  readonly service?: string;
  readonly technologies?: string[];
  readonly timeConfig: TimeConfig;
  readonly useLongTermDataOnly: boolean;
}

export interface FilterBuilder {
  readonly application?: string;
  readonly applicationBoundaryScope?: ApplicationBoundaryScope;
  readonly endpoint?: string;
  readonly endpointName?: string;
  readonly endpointTypes?: EndpointType[];
  readonly includeInternalCalls: boolean;
  readonly includeSyntheticCalls: boolean;
  readonly label?: string;
  readonly processReference?: EntityId;
  readonly service?: string;
  readonly technologies?: string[];
  readonly timeConfig?: TimeConfig;
  readonly useLongTermDataOnly: boolean;
}

export interface FilterInterface {
  readonly rbacRestrictions?: any;
  readonly timeConfig?: TimeConfig;
}

export interface FilterableListItem {
}

export interface FilteredQuery extends UiQuery {
  readonly filter?: FilterInterface;
}

export interface FlowNode {
  readonly applications: Application[];
  readonly connectionMetrics: { [index: string]: number[][] };
  readonly endpoint?: Endpoint;
  readonly metrics: { [index: string]: number[][] };
  readonly relatedNodes?: FlowNode[];
  readonly relatedNodesCount: number;
  readonly service: Service;
}

export interface FullLogItem {
  readonly content: string;
  readonly id: string;
  readonly tags: LoggingTag[];
  readonly timestamp: number;
}

export interface FullTrace {
  readonly id: string;
  readonly rootSpan: Span;
  readonly totalErrorCount: number;
}

export interface GetAppDataEntityChainsQuery extends CursorPaginatedQuery {
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly level: Level;
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly rbacRestrictions?: any;
  readonly searchTerm: string;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface GetApplicationAlertClustersQuery extends UiQuery {
  readonly applicationId?: string;
  readonly endpointId?: string;
  readonly granularity: number;
  readonly rbacRestrictions?: any;
  readonly serviceId?: string;
  readonly timeConfig: TimeConfig;
}

export interface GetApplicationEntityHealthInfoQuery {
  readonly applicationId?: string;
  readonly endpointId?: string;
  readonly serviceId?: string;
  readonly timeConfig: TimeConfig;
}

export interface GetApplicationLiveViewQuery extends PaginatedUIQuery {
  readonly downstreamScope: ApplicationDownstreamScope;
  readonly pagination: Pagination;
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface GetApplicationMetricsAlertPreviewQuery extends GetApplicationMetricsNonClusteredAlertPreviewQuery {
  readonly granularity: number;
}

export interface GetApplicationMetricsNonClusteredAlertPreviewQuery extends UiQuery {
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly threshold: ThresholdData;
  readonly timeConfig: TimeConfig;
  readonly timeThreshold: ApplicationTimeThreshold;
}

export interface GetApplicationMetricsQuery extends QueryWithMetrics, UiQuery, QueryWithPrecision {
  readonly dataSource?: MetricDataSource;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
}

export interface GetApplicationMetricsThresholdSuggestionQuery extends AbstractThresholdSuggestionQuery {
  readonly alertEvaluationType?: AlertEvaluationType;
  readonly evaluationType?: AlertEvaluationType;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly metric: AppDataMetricConfiguration;
}

export interface GetApplicationPotentialProblemsQuery extends FilteredQuery {
  readonly alertRules?: { [index: string]: AlertRuleWithGranularity };
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface GetApplicationQuery extends UiQuery {
  readonly id: string;
  readonly rbacRestrictions?: any;
}

export interface GetApplicationServiceIdForCloudfoundryApplicationServiceUidQuery extends UiQuery {
  readonly appId: string;
  readonly entityId?: string;
  readonly metrics?: { [index: string]: AppDataMetricConfiguration };
  readonly order?: Order;
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
}

export interface GetApplicationServiceIdForKubernetesServiceUidQuery extends UiQuery {
  readonly kubernetesServiceId: string;
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
}

export interface GetApplicationsCursorPaginatedQuery extends CursorPaginatedQuery, QueryWithMetrics, QueryWithPrecision {
  readonly contextScope?: ContextScope;
  readonly filter: Filter;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly supportedOrderByCriteria: boolean;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
}

export interface GetApplicationsQuery extends PaginatedQuery {
  readonly contextScope?: ContextScope;
  readonly filter: Filter;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly supportedOrderByCriteria: boolean;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
}

export interface GetAvailableMetricsQuery {
  readonly filter: TagSetFilter;
  readonly query?: string;
  readonly type?: string;
}

export interface GetAvailablePluginsQuery {
  readonly filter: TagSetFilter;
}

export interface GetCallGroupsQuery extends CursorPaginatedQuery, FilteredQuery, QueryWithPrecision, QueryWithMetrics {
  readonly expectedGroups?: string[];
  readonly filter: Filter;
  readonly group: Group;
  readonly includeInternal: boolean;
  readonly includeOthers: boolean;
  readonly includeSynthetic: boolean;
  readonly metrics: { [index: string]: MetricConfiguration };
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly removeUnmatchedGroup: boolean;
  readonly tagFilterExpressionElement?: TagFilterExpressionElement;
  /**
   * @deprecated
   */
  readonly tagFilters?: TagFilter[];
  readonly timeShift: TimeShift;
}

export interface GetCallGroupsQueryBuilder {
}

export interface GetCallsQuery extends CursorPaginatedQuery, FilteredQuery, QueryWithPrecision {
  readonly filter: Filter;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpressionElement?: TagFilterExpressionElement;
  /**
   * @deprecated
   */
  readonly tagFilters?: TagFilter[];
}

export interface GetCloudfoundryApplicationQuery extends UiQuery {
  readonly filter: CloudfoundryQueryFilter;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly rbacRestrictions?: any;
}

export interface GetCloudfoundryApplicationsByTagsQuery extends UiQuery {
  readonly tagFilters: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetCloudfoundryApplicationsForApplicationServiceQuery extends UiQuery {
  readonly applicationId?: string;
  readonly rbacRestrictions?: any;
  readonly serviceId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetCloudfoundryApplicationsQuery extends PaginatedQuery {
  readonly filter: CloudfoundryQueryFilter;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetCloudfoundryContainersQuery extends PaginatedQuery {
  readonly filter: CloudfoundryQueryFilter;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetDatabaseStatementTopListQuery extends TopListQuery {
  readonly filter: Filter;
  readonly metric: MetricConfiguration;
}

export interface GetDeprecationsQuery extends UiQuery {
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetEndpointInfoQuery extends UiQuery {
  readonly id: string;
}

export interface GetEndpointQuery extends FilteredQuery {
  readonly filter: Filter;
  readonly id: string;
}

export interface GetEndpointTypesQuery extends FilteredQuery {
  readonly filter: Filter;
}

export interface GetEndpointsCursorPaginatedQuery extends CursorPaginatedQuery, QueryWithMetrics, QueryWithPrecision {
  readonly filter: Filter;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly supportedOrderByCriteria: boolean;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface GetEndpointsQuery extends PaginatedQuery {
  readonly filter: Filter;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly supportedOrderByCriteria: boolean;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface GetEntitiesHealthQuery extends UiQuery {
  readonly ids: string[];
  readonly timeConfig: TimeConfig;
}

export interface GetEntityHealthQuery extends UiQuery {
  readonly snapshotId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetErrorMessagesMetricConfiguration extends MetricConfiguration {
}

export interface GetErrorMessagesQuery extends PaginatedQuery {
  readonly filter: Filter;
  readonly metrics: { [index: string]: GetErrorMessagesMetricConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly supportedOrderByCriteria: boolean;
}

export interface GetEumBeaconBackendTracesQuery extends UiQuery {
  readonly correlationId: string;
}

export interface GetFlowMapNodesQuery extends PaginatedQuery {
  readonly direction: FlowDirection;
  readonly filter: Filter;
  readonly metrics: { [index: string]: MetricConfiguration };
  readonly pagination: Pagination;
  readonly traversalConfiguration: ServiceFlowTraversalConfig;
}

export interface GetFullTraceQuery extends UiQuery {
  readonly id: string;
}

export interface GetInfraMetricsCatalogQuery {
  readonly filter: TagSetFilter;
  readonly query?: string;
  readonly type?: string;
}

export interface GetInfrastructureExploreQuery {
  readonly filter: TagSetFilter;
  readonly metrics?: { [index: string]: InfraMetricQuery };
  readonly order?: Order;
  readonly pagination?: CursorPagination<IngestionOffsetCursor>;
  readonly type?: string;
}

export interface GetInfrastructureExploreTagValueSuggestionsQuery {
  readonly partialValue?: string;
  readonly tagName?: string;
  readonly timeConfig?: TimeConfig;
  readonly valueCount: number;
}

export interface GetInfrastructureGroupsQuery {
  readonly filter: TagSetFilter;
  readonly firstPageOnly: boolean;
  readonly groupBy: string[];
  readonly metrics?: { [index: string]: InfraMetricQuery };
  readonly order?: Order;
  readonly pagination?: CursorPagination<IngestionOffsetCursor>;
  readonly type?: string;
}

export interface GetInfrastructureQuery extends PaginatedQuery {
  readonly category: string;
  readonly filter: Filter;
  readonly includeApplicationFilter: boolean;
  readonly metrics: { [index: string]: MetricConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetInternalEventsQuery extends CursorPaginatedQuery {
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly query?: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesClusterByRelationQuery extends UiQuery, FilteredQuery {
  readonly filter: KubernetesClusterQueryFilter;
}

export interface GetKubernetesClusterItemCountersQuery {
  readonly clusterId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesClusterQuery extends UiQuery {
  readonly id: string;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesClustersQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly metrics?: { [index: string]: KubernetesMetricConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesConditionsQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesContainersQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesCronJobItemCountersQuery {
  readonly cronJobId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesCronJobQuery extends UiQuery {
  readonly id: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesCronJobsQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesEndpointsQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesEventsQuery extends UiQuery {
  readonly filter: KubernetesQueryFilter;
  readonly order: Order;
  readonly pagination: Pagination;
  readonly query?: string;
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
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesJobsQuery extends CursorPaginatedQuery, QueryWithMetrics {
  readonly filter: KubernetesQueryFilter;
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
}

export interface GetKubernetesMonitoringStateQuery {
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesNamespaceItemCountersQuery {
  readonly namespaceId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesNamespaceQuery extends UiQuery {
  readonly id: string;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesNamespacesQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly granularity: number;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesNodeByHostQuery extends UiQuery, FilteredQuery {
  readonly filter: KubernetesQueryFilter;
}

export interface GetKubernetesNodeItemCountersQuery {
  readonly nodeId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesNodeQuery extends UiQuery {
  readonly id: string;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesNodesQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly granularity: number;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesPersistentVolumesQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly granularity: number;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesPodQuery extends UiQuery {
  readonly id: string;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesPodsQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly granularity: number;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesServiceForApplicationServiceIdQuery extends UiQuery {
  readonly rbacRestrictions?: any;
  readonly serviceId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesServiceItemCountersQuery {
  readonly serviceId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesServiceQuery extends UiQuery {
  readonly id: string;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesServicesByTagsQuery extends UiQuery {
  readonly tagFilters: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesServicesForApplicationServiceQuery extends UiQuery {
  readonly applicationId?: string;
  readonly rbacRestrictions?: any;
  readonly serviceId: string;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesServicesQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetKubernetesTreemapQuery extends UiQuery {
  readonly filter: KubernetesQueryFilter;
  readonly grouping?: KubernetesTreemapGrouping;
}

export interface GetKubernetesWorkloadControllerItemCountersQuery {
  readonly timeConfig: TimeConfig;
  readonly workloadControllerId: string;
}

export interface GetKubernetesWorkloadControllerQuery extends UiQuery {
  readonly id: string;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
}

export interface GetKubernetesWorkloadControllersQuery extends PaginatedQuery {
  readonly filter: KubernetesQueryFilter;
  readonly granularity: number;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetLatencyDistributionBase10Query extends FilteredQuery {
  readonly dataSource?: DataSource;
  readonly filter: FilterInterface;
  readonly includeInternal: boolean;
  readonly includePercentiles: boolean;
  readonly includeSynthetic: boolean;
  readonly maxLatencyBuckets: number;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  /**
   * @deprecated
   */
  readonly tagFilters?: TagFilter[];
  readonly timeShift?: TimeShift;
}

export interface GetLatencyHeatMapOverTimeQuery extends FilteredQuery {
  readonly filter: Filter;
  readonly maxLatencyBuckets: number;
  readonly maxTimeBuckets: number;
}

export interface GetLogGroupsQuery extends CursorPaginatedQuery, FilteredQuery {
  readonly groupBy?: string;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface GetLogMessagesQuery extends PaginatedQuery {
  readonly filter: Filter;
  readonly metrics: { [index: string]: MetricConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly supportedOrderByCriteria: boolean;
}

export interface GetLogQuery extends FilteredQuery {
  readonly id: string;
  readonly timeConfig?: TimeConfig;
}

export interface GetLogsDistributionQuery extends FilteredQuery {
  readonly granularity: number;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface GetLogsForConsoleQuery extends CursorPaginatedQuery, FilteredQuery {
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface GetLogsQuery extends CursorPaginatedQuery, FilteredQuery {
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface GetMetricMetadataQuery {
  readonly metric: string;
  readonly type: string;
}

export interface GetMetricsQuery extends QueryWithMetrics {
  readonly filter: Filter;
  readonly metrics: { [index: string]: MetricConfiguration };
}

export interface GetMobileAppBeaconGroupsQuery extends QueryWithMetrics, CursorPaginatedQuery {
  readonly group: MobileAppBeaconTagGroup;
  readonly includeOthers: boolean;
  readonly metrics: { [index: string]: MobileAppMonitoringMetricsConfiguration };
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
}

export interface GetMobileAppBeaconsForSessionQuery extends UiQuery {
  readonly beaconTimestamp?: number;
  readonly rbacRestrictions?: any;
  readonly sessionId: string;
  readonly userId?: string;
}

export interface GetMobileAppBeaconsQuery extends CursorPaginatedQuery {
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetMobileAppCountryBreakdownQuery extends PaginatedUIQuery {
  readonly order: Order;
  readonly pagination: Pagination;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetMobileAppMetricsQuery extends QueryWithMetrics, UiQuery {
  readonly metrics: { [index: string]: MobileAppMonitoringMetricsConfiguration };
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
}

export interface GetMobileAppPaginatedBeaconGroupsQuery extends PaginatedUIQuery {
  readonly group: MobileAppBeaconTagGroup;
  readonly metrics: { [index: string]: MobileAppMonitoringMetricsConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetMobileAppQuery extends UiQuery {
  readonly id: string;
  readonly rbacRestrictions?: any;
}

export interface GetMobileAppSubdivisionsQuery extends PaginatedUIQuery {
  readonly metrics: { [index: string]: MobileAppMonitoringMetricsConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetMobileAppsQuery extends PaginatedUIQuery {
  readonly labelFilter?: string;
  readonly metrics: { [index: string]: MobileAppMonitoringMetricsConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
}

export interface GetOpenEventsCountTimeSeriesQuery {
  readonly granularity: number;
  readonly query?: string;
  readonly timeConfig: TimeConfig;
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
  readonly processSnapshotId?: string;
  readonly timeConfig: TimeConfig;
}

export interface GetProfilesQuery extends FilteredQuery {
  readonly filter: Filter;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly processSnapshotId?: string;
}

export interface GetProfilesQueryBuilder {
}

export interface GetQueryableTagsQuery extends UiQuery {
  readonly tenantConfig: TenantConfig;
  readonly timeConfig?: TimeConfig;
}

export interface GetRawEventsQuery extends UiQuery {
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly query?: string;
  readonly timeConfig: TimeConfig;
}

export interface GetReferencesQuery {
  readonly config: { [index: string]: string };
}

export interface GetRelatedPluginsQuery extends PaginatedUIQuery {
  readonly tagFilterExpression?: TagFilterExpression;
  readonly timeConfig?: TimeConfig;
  readonly topSnapshotsPagination?: Pagination;
}

export interface GetReleaseClustersQuery extends UiQuery {
  readonly applicationId?: string;
  readonly granularity: number;
  readonly serviceId?: string;
  readonly timeConfig: TimeConfig;
}

export interface GetReleasesQuery extends PaginatedUIQuery {
  readonly filter?: string;
  readonly pagination: Pagination;
  readonly timeConfig?: TimeConfig;
}

export interface GetRetentionQuery extends UiQuery {
  readonly timeConfig: TimeConfig;
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

export interface GetServiceLabelQuery extends UiQuery {
  readonly id: string;
}

export interface GetServiceLinksByTagsQuery extends UiQuery {
  readonly metrics: { [index: string]: MetricConfiguration };
  readonly order: Order;
  readonly rbacRestrictions?: any;
  readonly tagFilters: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetServiceMapQuery extends FilteredQuery {
  readonly filter: Filter;
}

export interface GetServiceQuery extends FilteredQuery {
  readonly filter: Filter;
  readonly id: string;
}

export interface GetServicesCursorPaginatedQuery extends CursorPaginatedQuery, QueryWithMetrics, QueryWithPrecision {
  readonly contextScope?: ContextScope;
  readonly filter: Filter;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
}

export interface GetServicesQuery extends PaginatedQuery {
  readonly contextScope?: ContextScope;
  readonly filter: Filter;
  readonly metrics: { [index: string]: AppDataMetricConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
}

export interface GetSpanTreeNodeDetailsQuery extends UiQuery {
  readonly nodeId?: string;
  readonly traceId?: string;
}

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

export interface GetTagAvailabilityQuery extends UiQuery {
  readonly tagNames?: string[];
}

export interface GetTagAvailabilityResult {
  readonly tagAvailabilities?: { [index: string]: TagAvailability };
}

export interface GetTagSuggestionsQuery extends FilteredQuery {
  readonly entity: TagFilterEntity;
  readonly filter: Filter;
  readonly includeInternal?: boolean;
  readonly includeSynthetic?: boolean;
  readonly metrics?: { [index: string]: MetricConfiguration };
  readonly removeRequestedTagFromFilters?: boolean;
  readonly requestingSecondaryKeySuggestions: boolean;
  readonly secondLevelKeyTagName?: string;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly tagName: string;
  readonly valueFilter?: string;
}

export interface GetTagValueSuggestionsQuery extends FilteredQuery {
  readonly key?: string;
  readonly propose: TagSuggestionProposeType;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagName: string;
  readonly timeConfig: TimeConfig;
  readonly value?: string;
}

export interface GetTechnologyBreakdownQuery extends FilteredQuery {
  readonly breakdownType: BreakdownType;
  readonly filter: Filter;
  readonly granularity?: number;
}

export interface GetTraceActivityTreeQuery extends UiQuery {
  readonly id?: string;
}

export interface GetTraceGroupsQuery extends CursorPaginatedQuery, FilteredQuery, QueryWithPrecision {
  readonly filter: Filter;
  readonly group: Group;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly metrics: { [index: string]: MetricConfiguration };
  readonly order: Order;
  readonly pagination: CursorPagination<any>;
  readonly removeUnmatchedGroup: boolean;
  readonly tagFilterExpressionElement?: TagFilterExpressionElement;
  /**
   * @deprecated
   */
  readonly tagFilters?: TagFilter[];
}

export interface GetTraceGroupsQueryBuilder {
}

export interface GetTraceParticipantsQuery extends PaginatedUIQuery {
  readonly order: Order;
  readonly pagination: Pagination;
  readonly traceId: string;
}

export interface GetTraceSummaryQuery extends FilteredQuery {
  readonly filter?: Filter;
  readonly id: string;
}

export interface GetTracesQuery extends CursorPaginatedQuery, FilteredQuery, QueryWithPrecision {
  readonly filter: Filter;
  readonly includeInternal: boolean;
  readonly includeSynthetic: boolean;
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpressionElement?: TagFilterExpressionElement;
  /**
   * @deprecated
   */
  readonly tagFilters?: TagFilter[];
}

export interface GetTracesQueryBuilder {
}

export interface GetUnifiedMetricsQuery {
  readonly metrics: { [index: string]: UnifiedMetricConfiguration };
  readonly rbacRestrictions?: any;
}

export interface GetVsphereDatacentersQuery extends PaginatedQuery {
  readonly filter: VsphereQueryFilter;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetVsphereHostsQuery extends PaginatedQuery {
  readonly filter: VsphereQueryFilter;
  readonly order: Order;
  readonly pagination: Pagination;
}

export interface GetWebsiteAlertClustersQuery extends UiQuery {
  readonly granularity: number;
  readonly page?: string;
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
  readonly websiteId: string;
}

export interface GetWebsiteBeaconGroupsQuery extends QueryWithMetrics, CursorPaginatedQuery {
  readonly group: WebsiteBeaconTagGroup;
  readonly includeOthers: boolean;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
}

export interface GetWebsiteBeaconGroupsQueryBuilder {
}

export interface GetWebsiteBeaconsForPageLoadQuery extends UiQuery {
  readonly beaconTimestamp?: number;
  readonly pageLoadId: string;
  readonly rbacRestrictions?: any;
  readonly userId?: string;
}

export interface GetWebsiteBeaconsQuery extends CursorPaginatedQuery {
  readonly order: Order;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetWebsiteBeaconsQueryBuilder {
}

export interface GetWebsiteCountryBreakdownQuery extends PaginatedUIQuery {
  readonly order: Order;
  readonly pagination: Pagination;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetWebsiteErrorQuery extends UiQuery {
  readonly errorId: string;
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
  readonly websiteId?: string;
}

export interface GetWebsiteErrorsQuery extends PaginatedUIQuery {
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetWebsiteHealthInfoQuery {
  readonly timeConfig: TimeConfig;
  readonly websiteId: string;
}

export interface GetWebsiteMetricAlertsPreviewQuery extends UiQuery {
  readonly granularity: number;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly threshold: ThresholdData;
  readonly timeConfig: TimeConfig;
  readonly timeThreshold: WebsiteTimeThreshold;
}

export interface GetWebsiteMetricsQuery extends QueryWithMetrics, UiQuery {
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
}

export interface GetWebsiteMetricsQueryBuilder {
}

export interface GetWebsiteMetricsThresholdSuggestionQuery extends AbstractThresholdSuggestionQuery {
  readonly metric: WebsiteMonitoringMetricsConfiguration;
}

export interface GetWebsitePaginatedBeaconGroupsQuery extends PaginatedUIQuery {
  readonly group: WebsiteBeaconTagGroup;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetWebsiteQuery extends UiQuery {
  readonly id: string;
  readonly rbacRestrictions?: any;
}

export interface GetWebsiteRateMetricAlertsPreviewQuery extends UiQuery {
  readonly granularity: number;
  readonly metrics: { [index: string]: WebsiteRateMetricConfiguration };
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly threshold: ThresholdData;
  readonly timeConfig: TimeConfig;
  readonly timeThreshold: WebsiteTimeThreshold;
}

export interface GetWebsiteRateMetricQuery extends QueryWithMetrics, UiQuery {
  readonly metrics: { [index: string]: WebsiteRateMetricConfiguration };
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface GetWebsiteRateMetricThresholdSuggestionQuery extends AbstractThresholdSuggestionQuery {
  readonly metric: WebsiteRateMetricConfiguration;
}

export interface GetWebsiteSubdivisionsQuery extends PaginatedUIQuery {
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetWebsiteUniqueUsersInSlidingWindowQuery extends QueryWithMetrics {
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly slidingWindowSize: number;
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface GetWebsiteWebBrowsersQuery extends PaginatedUIQuery {
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
}

export interface GetWebsitesQuery extends PaginatedUIQuery {
  readonly labelFilter?: string;
  readonly metrics: { [index: string]: WebsiteMonitoringMetricsConfiguration };
  readonly order: Order;
  readonly pagination: Pagination;
  readonly rbacRestrictions?: any;
  readonly timeConfig: TimeConfig;
}

export interface GetWindowWidthBreakdownQuery extends UiQuery {
  readonly rbacRestrictions?: any;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly timeConfig: TimeConfig;
  readonly windowWidths: number[];
}

export interface GetWiringEdgesQuery extends UiQuery {
  readonly timeframe: Timeframe;
}

export interface GlobalApplicationAlertConfigWithMetadata extends GlobalApplicationsAlertConfig, VersionedConfig {
  readonly applicationIds?: string[];
  readonly builtIn: boolean;
  readonly id: string;
}

export interface GlobalApplicationsAlertConfig extends AbstractApplicationAlertConfig {
  readonly applications: { [index: string]: ApplicationNode };
}

export interface Group {
  readonly groupbyTag: string;
  readonly groupbyTagEntity: TagFilterEntity;
  readonly groupbyTagSecondLevelKey?: string;
}

export interface GroupBuilder {
  readonly items?: Item[];
}

export interface GroupKey {
  readonly contextGuideGroup?: EntityContextGuideGroup;
  readonly relationship?: Relationship;
  readonly type?: string;
}

export interface Grouping {
  readonly aggregation?: AggregationType;
  readonly by: Group;
  readonly direction: OrderDirection;
  readonly includeOthers: boolean;
  readonly includeUnmatched: boolean;
  readonly maxResults: number;
  readonly metric?: string;
}

export interface HasLogsQuery {
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface HasLogsResult {
  readonly hasLogs: boolean;
}

export interface Health {
  readonly metadata?: { [index: string]: any };
  readonly owners?: EntityId[];
  readonly problems?: ProblemObject[];
  readonly triggeringTime: number;
}

export interface HealthDownstreamValue {
  readonly data?: Health;
  readonly host_id?: string;
  readonly path?: string;
  readonly plugin_id?: string;
  readonly steady_id?: string;
  readonly timestamp: number;
}

export interface HealthInfo {
  readonly explanation: string;
  readonly partOfIncident: boolean;
  readonly type: Type;
}

export interface HealthRule {
  readonly allowedSnapshotIds: string[];
  readonly description: string;
  readonly id: string;
  readonly plugin: string;
}

export interface HistoricBaselineConfig extends ThresholdConfig {
  readonly baseline?: number[][];
  readonly deviationFactor: number;
  readonly lastUpdated: number;
  readonly seasonality: Seasonality;
}

export interface HistoricBaselineData extends ThresholdData {
  readonly baseline: number[][];
  readonly deviationFactor: number;
  readonly seasonality: Seasonality;
}

export interface HistoricBaselineSuggestionResponse extends ThresholdSuggestionResponse {
  readonly baseline: number[][];
  readonly seasonality?: Seasonality;
}

export interface HostAvailabilityRule extends AbstractRule {
  readonly closeAfter: number;
  readonly offlineDuration: number;
  readonly tagFilter?: TagFilter;
}

export interface Incident extends Event {
  readonly issueOrderMap?: { [index: string]: number };
  readonly recentEvents?: string[];
  readonly triggeringEvent: string;
}

export interface InfraMetricConfiguration extends UnifiedMetricConfiguration {
  readonly grouping?: Grouping[];
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly type: string;
}

export interface InfraMetricQuery {
  readonly aggregation: AggregationType;
  readonly granularity?: number;
  readonly metric: string;
}

export interface InfraTagValueSuggestions {
  readonly suggestions?: string[];
  readonly totalHits: number;
}

export interface InfrastructureExploreItem {
  readonly label?: string;
  readonly metrics?: { [index: string]: number[][] };
  readonly plugin?: string;
  readonly snapshotId?: string;
  readonly time: number;
}

export interface InfrastructureGroup {
  readonly count: number;
  readonly metrics?: { [index: string]: number[][] };
  readonly tags?: { [index: string]: any };
}

export interface InfrastructureItem {
  readonly metrics: { [index: string]: number[][] };
  readonly physicalContext: PhysicalContext;
}

export interface IngestionOffsetCursor extends Cursor {
  readonly ingestionTime: number;
  readonly offset: number;
}

export interface Item {
  readonly healthInfo?: HealthInfo;
  readonly id: string;
  readonly label: string;
  readonly metrics: { [index: string]: number[][] };
  readonly shortLabel: string;
  readonly type: string;
}

export interface JavaScriptError {
  readonly componentStack?: string;
  readonly errorType?: string;
  readonly id: string;
  readonly message: string;
  readonly parsedStackTrace?: StackTraceLine[];
  readonly stackTrace?: string;
  readonly stackTraceParsingStatus: number;
}

export interface KubernetesAnnotation {
  readonly key: string;
  readonly value: string;
}

export interface KubernetesCluster {
  readonly clusterDistribution: string;
  /**
   * @deprecated
   */
  readonly clusterManagedBy: string;
  readonly clusterManagement: KubernetesClusterManagement;
  readonly componentStatuses: ComponentStatus[];
  readonly debuggingInfo?: { [index: string]: any };
  readonly id: string;
  readonly label: string;
  readonly missingAppsPermissions: boolean;
  readonly version: string;
}

export interface KubernetesClusterItemCounters {
  readonly cronJobs: number;
  readonly hosts: number;
  readonly namespaces: number;
  readonly nodes: number;
  readonly persistentVolumes: number;
  readonly services: number;
  readonly workloads: WorkloadCounters;
}

export interface KubernetesClusterListItem extends FilterableListItem {
  readonly cluster: KubernetesCluster;
  readonly cronJobs: number;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly id?: string;
  readonly name?: string;
  readonly namespaces: number;
  readonly nodes: number;
  readonly persistentVolumes: number;
  readonly services: number;
  readonly workloads: WorkloadCounters;
}

export interface KubernetesClusterManagement {
  readonly fullName: string;
  readonly shortName: string;
}

export interface KubernetesClusterQueryFilter extends FilterInterface {
  readonly resourceSnapshotId?: string;
  readonly timeConfig: TimeConfig;
}

export interface KubernetesClusterQueryFilterBuilder {
  readonly resourceSnapshotId?: string;
  readonly timeConfig?: TimeConfig;
}

export interface KubernetesCondition {
  readonly lastTransitionTime: string;
  readonly message: string;
  readonly reason: string;
  readonly status: string;
  readonly type: string;
}

export interface KubernetesConditionListItem extends FilterableListItem {
  readonly lastTransitionTime: string;
  readonly message: string;
  readonly reason?: string;
  readonly status: string;
  readonly type: string;
}

export interface KubernetesContainer {
  readonly id: string;
  readonly label: string;
  readonly plugin: string;
  readonly uid: string;
}

export interface KubernetesContainerListItem extends FilterableListItem {
  readonly container: KubernetesContainer;
  readonly containerLabel?: string;
  readonly entityHealthInfo: EntityHealthInfo;
}

export interface KubernetesContainerStateRunning extends AbstractKubernetesContainerState {
}

export interface KubernetesContainerStateTerminated extends AbstractKubernetesContainerState {
  readonly exitCode: number;
  readonly reason?: string;
  readonly signal: number;
}

export interface KubernetesContainerStateWaiting extends AbstractKubernetesContainerState {
  readonly reason?: string;
}

export interface KubernetesContainerStatus {
  readonly containerSnapshotId: string;
  readonly name: string;
  readonly ready: boolean;
  readonly state: AbstractKubernetesContainerState;
}

export interface KubernetesCronJob {
  readonly concurrencyPolicy?: string;
  readonly conditions: KubernetesCondition[];
  readonly entityHealthInfo: EntityHealthInfo;
  readonly entityId?: EntityId;
  readonly id?: string;
  readonly labels?: KubernetesLabel[];
  readonly lastScheduled?: string;
  readonly name?: string;
  readonly schedule?: string;
}

export interface KubernetesCronJobItemCounters {
  readonly jobs: number;
  readonly pods: number;
}

export interface KubernetesCronJobListItem extends FilterableListItem {
  readonly cronJob: KubernetesCronJob;
  readonly cronJobName?: string;
  readonly entityHealthInfo: EntityHealthInfo;
}

export interface KubernetesEndpoint {
  readonly external: number;
  readonly internal: number;
  readonly pods: number;
  readonly serviceUid: string;
}

export interface KubernetesEndpointAddressListItem extends FilterableListItem {
  readonly address: string;
  readonly podName?: string;
  readonly podSnapshotId?: string;
  readonly port?: number;
  readonly portName?: string;
  readonly protocol?: string;
  readonly ready?: boolean;
}

export interface KubernetesEventListItem extends FilterableListItem {
  readonly detailText?: string;
  readonly kind?: string;
  readonly name?: string;
  readonly namespace?: string;
  readonly sourceId?: string;
  readonly sourcePlugin?: string;
  readonly time: number;
  readonly title?: string;
  readonly type?: string;
}

export interface KubernetesHostListItem extends FilterableListItem {
  readonly id: string;
  readonly label?: string;
  readonly plugin: string;
}

export interface KubernetesIds {
  readonly clusterId?: string;
  /**
   * @deprecated
   */
  readonly deploymentId?: string;
  readonly namespaceId?: string;
  readonly workloadControllerId?: string;
  readonly workloadControllerType?: string;
}

export interface KubernetesIdsBuilder {
  readonly clusterId?: string;
  readonly namespaceId?: string;
  readonly workloadControllerId?: string;
  readonly workloadControllerType?: string;
}

export interface KubernetesJob {
  readonly age: number;
  readonly clusterId: string;
  readonly completedAt?: string;
  readonly cronJobOwner: string;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly id: string;
  readonly label: string;
  readonly labels: KubernetesLabel[];
  readonly namespace: string;
  readonly startAt: string;
  readonly status: string;
}

export interface KubernetesJobListCursorPaginatedItem extends FilterableListItem, Cursorific<IngestionOffsetCursor> {
  readonly age?: number;
  readonly cursor: IngestionOffsetCursor;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly job: KubernetesJob;
  readonly label?: string;
  readonly namespace?: string;
  readonly podIds?: string[];
  readonly status?: string;
}

export interface KubernetesJobListItem extends FilterableListItem {
  readonly age?: number;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly job: KubernetesJob;
  readonly label?: string;
  readonly namespace?: string;
  readonly podIds?: string[];
  readonly status?: string;
}

export interface KubernetesJobStatusComparator extends Comparator<string> {
}

export interface KubernetesLabel {
  readonly key: string;
  readonly value: string;
}

export interface KubernetesMetricConfiguration extends MetricConfiguration {
}

export interface KubernetesNamespace {
  readonly age?: number;
  readonly clusterDistribution: string;
  readonly clusterName: string;
  readonly entityId?: EntityId;
  readonly id: string;
  readonly label: string;
  readonly labels: KubernetesLabel[];
  readonly status: string;
}

export interface KubernetesNamespaceItemCounters {
  readonly cronJobs: number;
  readonly services: number;
  readonly volumes: number;
  readonly workloads: WorkloadCounters;
}

export interface KubernetesNamespaceListItem extends FilterableListItem, ListItemWithMetric {
  readonly clusterName?: string;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly id?: string;
  readonly label?: string;
  readonly namespace: KubernetesNamespace;
  readonly pods: number;
  readonly services: number;
  readonly workloads: WorkloadCounters;
}

export interface KubernetesNode {
  readonly age?: number;
  readonly bootId: string;
  readonly clusterDistribution: string;
  readonly clusterId: string;
  readonly conditions: KubernetesCondition[];
  readonly entityId?: EntityId;
  readonly externalIp?: string;
  readonly hostname: string;
  readonly id: string;
  readonly internalIp: string;
  readonly labels: KubernetesLabel[];
  readonly machineId: string;
  readonly name: string;
  readonly roles?: string;
  readonly status: string;
  readonly version: string;
}

export interface KubernetesNodeItemCounters {
  readonly pods: number;
  readonly volumes: number;
}

export interface KubernetesNodeListItem extends ListItemWithMetric, FilterableListItem {
  readonly age?: number;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly name?: string;
  readonly node: KubernetesNode;
  readonly pods: number;
  readonly roles?: string;
  readonly status?: string;
  readonly version?: string;
}

export interface KubernetesPersistentVolume {
  readonly entityId: EntityId;
  readonly id: string;
  readonly labels: KubernetesLabel[];
  readonly name: string;
  readonly phase: string;
  readonly reclaimPolicy: string;
  readonly storageClassName: string;
  readonly volumeMode: string;
}

export interface KubernetesPersistentVolumeListItem extends FilterableListItem {
  readonly entityHealthInfo: EntityHealthInfo;
  readonly name?: string;
  readonly persistentVolume: KubernetesPersistentVolume;
  readonly phase?: string;
}

export interface KubernetesPhysicalContext {
  readonly cluster?: SnapshotPreview;
  readonly namespace?: SnapshotPreview;
  readonly node?: SnapshotPreview;
  readonly pod?: SnapshotPreview;
}

export interface KubernetesPod {
  readonly age?: number;
  readonly clusterDistribution: string;
  readonly clusterId: string;
  readonly conditions: KubernetesCondition[];
  readonly entityId?: EntityId;
  readonly hostIp: string;
  readonly id: string;
  readonly label: string;
  readonly labels: KubernetesLabel[];
  readonly namespace: string;
  readonly podIp: string;
  readonly resources: { [index: string]: KubernetesResources };
  readonly status?: KubernetesPodStatus;
  readonly volumes: number;
}

export interface KubernetesPodCondition {
  readonly message: string;
  readonly reason: string;
  readonly status: string;
  readonly type: string;
}

export interface KubernetesPodListItem extends ListItemWithMetric, FilterableListItem {
  readonly age?: number;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly label?: string;
  readonly namespace?: string;
  readonly phase?: string;
  readonly pod: KubernetesPod;
  readonly statusSummary?: string;
}

export interface KubernetesPodPhaseComparator extends Comparator<string> {
}

export interface KubernetesPodStatus {
  readonly containerStatuses: KubernetesContainerStatus[];
  readonly initContainerStatuses: KubernetesContainerStatus[];
  readonly message?: string;
  readonly phase: string;
  readonly reason?: string;
  readonly statusSummary?: string;
}

export interface KubernetesPodStatusComparator extends Comparator<string> {
}

export interface KubernetesPort {
  readonly name: string;
  readonly nodePort?: string;
  readonly port?: string;
  readonly protocol: string;
  readonly targetPort?: string;
}

export interface KubernetesQueryFilter extends FilterInterface {
  readonly clusterId?: string;
  readonly cronJobId?: string;
  readonly daemonSetId?: string;
  readonly deploymentConfigId?: string;
  readonly deploymentId?: string;
  readonly hostId?: string;
  readonly label?: string;
  readonly namespaceId?: string;
  readonly nodeId?: string;
  readonly phase?: string;
  readonly podId?: string;
  readonly serviceId?: string;
  readonly statefulSetId?: string;
  readonly timeConfig: TimeConfig;
  readonly workloadControllerId?: string;
  readonly workloadOwnerId?: string;
}

export interface KubernetesQueryFilterBuilder {
  readonly clusterId?: string;
  readonly cronJobId?: string;
  readonly daemonSetId?: string;
  readonly deploymentConfigId?: string;
  readonly deploymentId?: string;
  readonly hostId?: string;
  readonly label?: string;
  readonly namespaceId?: string;
  readonly nodeId?: string;
  readonly phase?: string;
  readonly podId?: string;
  readonly serviceId?: string;
  readonly statefulSetId?: string;
  readonly timeConfig?: TimeConfig;
  readonly workloadControllerId?: string;
  readonly workloadOwnerId?: string;
}

export interface KubernetesResources {
  readonly cpuLimits: number;
  readonly cpuRequests: number;
  readonly memoryLimits: number;
  readonly memoryRequests: number;
}

export interface KubernetesSelector {
  readonly key: string;
  readonly value: string;
}

export interface KubernetesService {
  readonly age: number;
  readonly clusterDistribution: string;
  readonly clusterName: string;
  readonly created: number;
  readonly deploymentIds: string[];
  readonly id: string;
  readonly labels: KubernetesLabel[];
  readonly location: string;
  readonly name: string;
  readonly namespace: string;
  readonly ports: KubernetesPort[];
  readonly selector: string;
  readonly selectors: KubernetesSelector[];
  readonly type: string;
  readonly uid: string;
}

export interface KubernetesServiceItemCounters {
  readonly workloads: WorkloadCounters;
}

export interface KubernetesServiceLink {
  readonly clusterName: string;
  readonly entityHealthInfo?: EntityHealthInfo;
  readonly healthInfo?: EntityHealthInfo;
  readonly name: string;
  readonly namespace: string;
  readonly snapshotId: string;
  readonly type: string;
  readonly uid: string;
}

export interface KubernetesServiceListItem extends FilterableListItem {
  readonly age: number;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly externalEndpoints: number;
  readonly id: string;
  readonly internalEndpoints: number;
  readonly location: string;
  readonly name: string;
  readonly namespace: string;
  readonly pods: number;
  readonly type: string;
}

export interface KubernetesWorkloadController {
  readonly clusterDistribution: string;
  readonly clusterId: string;
  readonly conditions: KubernetesCondition[];
  readonly entityId?: EntityId;
  readonly id: string;
  readonly labels: KubernetesLabel[];
  readonly name: string;
  readonly namespace: string;
}

export interface KubernetesWorkloadControllerItemCounters {
  readonly nodes: number;
  readonly pods: number;
  readonly services: number;
  readonly volumes: number;
}

export interface KubernetesWorkloadControllerListItem extends ListItemWithMetric, FilterableListItem {
  readonly deployment?: KubernetesWorkloadController;
  readonly deploymentConfig?: KubernetesWorkloadController;
  readonly entityHealthInfo: EntityHealthInfo;
  readonly name?: string;
  readonly namespace?: string;
  readonly pods: number;
  readonly workloadController: KubernetesWorkloadController;
}

export interface LabeledMetricResult extends MetricResult {
  readonly label: string;
}

export interface LatencyBucket {
  readonly calls: number;
  readonly from: number;
  readonly to: number;
}

export interface LatencyBucketBase10 {
  readonly calls: number;
  readonly from: number;
  readonly tickMark: boolean;
  readonly to?: number;
}

export interface LatencyDistributionBase10 {
  readonly buckets: LatencyBucketBase10[];
  readonly percentiles?: LatencyPercentileBase10[];
}

export interface LatencyPercentileBase10 {
  readonly latency: number;
  readonly percentile: number;
}

export interface LegacyAlertStats {
  readonly customEvents: number;
  readonly legacyAlerts: number;
}

export interface LightServiceMap {
  readonly connections: ServiceMapConnection[];
  readonly services: Service[];
}

export interface ListItemWithMetric {
  readonly entityIdForMetric?: EntityId;
  readonly snapshotIdForMetric?: string;
  readonly sortedMetricValue?: number;
}

export interface ListWithTotal<T> {
  readonly items?: T[];
  readonly totalHits: number;
}

export interface Log {
  readonly content: string;
  readonly id: string;
  readonly tags: LoggingTag[];
  readonly timestamp: number;
}

export interface LogGroupItem extends Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly label: string;
  readonly numberOfLogs: number;
  readonly percentage: number;
}

export interface LogGroupsQuery {
  readonly group: Group;
  readonly pagination: CursorPagination<IngestionOffsetCursor>;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagTagFilterExpression?: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface LogItem {
  readonly itemId: string;
  readonly message: string;
  readonly tags: LogTag[];
  readonly timestamp: number;
}

export interface LogMessageItem {
  readonly level: string;
  readonly message: string;
  readonly metrics: { [index: string]: number[][] };
}

export interface LogQuery {
  readonly itemId: string;
  readonly tagFilterExpression?: TagFilterExpressionElement;
}

export interface LogTag {
  readonly booleanValue?: boolean;
  readonly doubleValue?: number;
  readonly key?: string;
  readonly longValue?: number;
  readonly name?: string;
  readonly stringValue?: string;
}

export interface LogTagSuggestionsQuery {
  readonly key?: string;
  readonly propose?: TagSuggestionProposeType;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagName: string;
  readonly timeConfig: TimeConfig;
  readonly value?: string;
}

export interface LoggingGroup {
  readonly label: string;
}

export interface LoggingLogGroupItem extends Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly group: LoggingGroup;
}

export interface LoggingLogItem extends Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly log: Log;
}

export interface LoggingLogTag {
  readonly label?: string;
  readonly name?: string;
}

export interface LoggingTag {
  readonly tag: LoggingLogTag;
  readonly value: string;
}

export interface LogsApplicationAlertRule extends ApplicationAlertRule {
  readonly level: LogsApplicationAlertRuleLogLevel;
  readonly loglevel?: LogsApplicationAlertRuleLogLevel;
  readonly message?: string;
  readonly operator: TagFilterOperator;
}

export interface LogsAvailable {
  readonly containsLogs: boolean;
}

export interface LogsDistributionQuery {
  readonly granularity: number;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface LogsQuery {
  readonly afterKey?: string;
  readonly beforeKey?: string;
  readonly retrievalSize: number;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tags?: string[];
  readonly timeConfig: TimeConfig;
}

export interface LogsResult {
  readonly afterKey?: string;
  readonly beforeKey?: string;
  readonly items?: LogItem[];
  readonly percentage: number;
}

export interface MaintenanceConfig {
  readonly id: string;
  readonly name: string;
  readonly query: string;
  readonly windows?: MaintenanceWindow[];
}

export interface MaintenanceConfigWithLastUpdated extends MaintenanceConfig {
  readonly lastUpdated: number;
}

export interface MaintenanceConfigWithStatus extends MaintenanceConfigWithLastUpdated {
  readonly status: MaintenanceStatus;
}

export interface MaintenanceWindow {
  readonly end: number;
  readonly id: string;
  readonly start: number;
}

export interface Message {
  readonly errorCode: ErrorCode;
  readonly subscriptionId?: number;
  readonly text: string;
  readonly title: string;
}

export interface MetricConfiguration {
  readonly aggregation: AggregationType;
  readonly granularity?: number;
  readonly metric: string;
}

export interface MetricDescription {
  readonly aggregations: AggregationType[];
  readonly description?: string;
  readonly formatter: string;
  readonly label: string;
  readonly metricId: string;
}

export interface MetricMetadata {
  readonly category?: string;
  readonly format?: Formatter;
  readonly id?: string;
  readonly infraTagCategory: InfraTagCategory;
  readonly label?: string;
  readonly ownerType?: string;
}

export interface MetricPattern {
  readonly operator: AlertingMatchingOperator;
  readonly placeholder?: string;
  readonly postfix?: string;
  readonly prefix: string;
}

export interface MetricQuery {
  readonly aggregation?: AggregationType;
  readonly metric: string;
  readonly rollup?: number;
  readonly rollupOrDefault: number;
  readonly snapshotId: string;
  readonly timeConfig: TimeConfig;
}

export interface MetricResult {
  readonly id: string;
  readonly values: number[][];
}

export interface Metricific {
  readonly metrics?: { [index: string]: number[][] };
}

export interface MobileApp {
  readonly id: string;
  readonly label: string;
}

export interface MobileAppBeaconGroupsItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly earliestTimestamp: number;
  readonly metrics: { [index: string]: number[][] };
  readonly name: string;
}

export interface MobileAppBeaconTagGroup extends Group {
}

export interface MobileAppBeaconsItem extends Cursorific<IngestionOffsetCursor> {
  readonly beacon: MobileAppMonitoringBeacon;
  readonly cursor: IngestionOffsetCursor;
}

export interface MobileAppCountryBreakdown {
  readonly continent: string;
  readonly continentCode: string;
  readonly country: string;
  readonly countryCode: string;
  readonly sessions: number;
}

export interface MobileAppItem {
  readonly metrics: { [index: string]: number[][] };
  readonly mobileApp: MobileApp;
}

export interface MobileAppMetricConfiguration extends UnifiedMetricConfiguration {
  readonly beaconType?: string;
  readonly grouping?: Grouping[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
}

export interface MobileAppMonitoringBeacon {
  readonly accuracyRadius: number;
  readonly agentVersion?: string;
  readonly appBuild?: string;
  readonly appVersion?: string;
  readonly backendTraceId?: string;
  readonly batchSize: number;
  readonly beaconId: string;
  readonly bundleIdentifier?: string;
  readonly carrier?: string;
  readonly city?: string;
  readonly clockSkew: number;
  readonly connectionType?: string;
  readonly continent?: string;
  readonly continentCode?: string;
  readonly country?: string;
  readonly countryCode?: string;
  readonly customEventName?: string;
  readonly decodedBodySize: number;
  readonly deviceHardware?: string;
  readonly deviceManufacturer?: string;
  readonly deviceModel?: string;
  readonly duration: number;
  readonly effectiveConnectionType?: string;
  readonly encodedBodySize: number;
  readonly environment?: string;
  readonly errorCount: number;
  readonly errorId?: string;
  readonly errorMessage?: string;
  readonly errorType?: string;
  readonly googlePlayServicesMissing: boolean;
  readonly httpCallMethod?: string;
  readonly httpCallOrigin?: string;
  readonly httpCallPath?: string;
  readonly httpCallStatus: number;
  readonly httpCallUrl?: string;
  readonly ingestionTime: number;
  readonly latitude: number;
  readonly longitude: number;
  readonly meta?: { [index: string]: string };
  readonly mobileAppId: string;
  readonly mobileAppLabel?: string;
  readonly osName?: string;
  readonly osVersion?: string;
  readonly platform?: string;
  readonly region?: string;
  readonly rooted: boolean;
  readonly sessionId: string;
  readonly stackTrace?: string;
  readonly subdivision?: string;
  readonly subdivisionCode?: string;
  readonly tenant?: string;
  readonly timestamp: number;
  readonly transferSize: number;
  readonly type: string;
  readonly unit?: string;
  readonly userEmail?: string;
  readonly userId?: string;
  readonly userIp?: string;
  readonly userLanguages?: string[];
  readonly userName?: string;
  readonly view?: string;
  readonly viewportHeight: number;
  readonly viewportWidth: number;
}

export interface MobileAppMonitoringMetricDescription extends MetricDescription {
  readonly beaconTypes: string[];
  readonly pathToValueInBeacon?: string[];
  readonly tagName?: string;
}

export interface MobileAppMonitoringMetricsConfiguration extends MetricConfiguration {
}

export interface MobileAppPaginatedBeaconGroupsItem {
  readonly earliestTimestamp: number;
  readonly metrics: { [index: string]: number[][] };
  readonly name: string;
}

export interface MobileAppSubdivisionsItem {
  readonly continent: string;
  readonly continentCode: string;
  readonly country: string;
  readonly countryCode: string;
  readonly metrics: { [index: string]: number[][] };
  readonly subdivision: string;
  readonly subdivisionCode?: string;
}

export interface OperatingSystem {
  readonly name: string;
  readonly version?: string;
}

export interface Order {
  readonly by: string;
  readonly direction: OrderDirection;
}

export interface PaginatedQuery extends QueryWithMetrics, PaginatedUIQuery {
}

export interface PaginatedRelatedSnapshots {
  readonly items?: SnapshotItem[];
  readonly totalHits: number;
}

export interface PaginatedResult<T> {
  readonly items: T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalHits: number;
}

export interface PaginatedUIQuery extends UiQuery {
  readonly order?: Order;
  readonly pagination?: Pagination;
}

export interface Pagination {
  readonly page: number;
  readonly pageSize: number;
}

export interface PhysicalContext {
  readonly cloudfoundry?: CloudfoundryPhysicalContext;
  readonly cluster?: SnapshotPreview;
  readonly container?: SnapshotPreview;
  readonly host?: SnapshotPreview;
  readonly kubernetes?: KubernetesPhysicalContext;
  readonly process?: SnapshotPreview;
}

export interface PotentialProblems {
  readonly alerts?: Alert[];
  readonly thresholds?: { [index: string]: ThresholdData };
}

export interface Problem {
  readonly fixSuggestion?: string;
  readonly id: string;
  readonly problemText?: string;
  readonly severity: number;
}

export interface ProblemObject {
  readonly experimental: boolean;
  readonly expiresIn: number;
  readonly expires_in: number;
  readonly explanation?: string;
  readonly fixSuggestion?: string;
  readonly fix_suggestion?: string;
  readonly problemText?: string;
  readonly problem_text?: string;
  readonly severity: number;
}

export interface ProcessGroup {
  readonly groupName: string;
  readonly metrics: { [index: string]: number[][] };
  readonly technologies: string[];
}

export interface ProcessGroupsItem extends Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly processGroup: ProcessGroup;
}

export interface ProcessesItem extends Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly profiledProcess: ProfiledProcess;
}

export interface Profile {
  readonly numProcesses: number;
  readonly profileGraph?: ProfileNode[];
  readonly profilePaths?: ProfilePath[];
  readonly rawProfileTimestamps?: number[];
  readonly runtime: string;
  readonly type: string;
  readonly unit: string;
}

export interface ProfileNode {
  readonly children?: ProfileNode[];
  readonly fileLine: number;
  readonly fileName?: string;
  readonly measurement: number;
  readonly methodName?: string;
  readonly numSamples: number;
  readonly percent: number;
}

export interface ProfilePath {
  readonly numProcesses: number;
  readonly profileNodes?: ProfileNode[];
}

export interface ProfiledProcess {
  readonly entityLabel: string;
  readonly entityPlugin?: string;
  readonly hostSnapshotPreview?: SnapshotPreview;
  readonly metrics: { [index: string]: number[][] };
  readonly processSnapshotId: string;
  readonly time: number;
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

export interface Progress {
  readonly loading: boolean;
  readonly note?: string;
  readonly percentage?: number;
}

export interface QueryWithMetrics extends FilteredQuery {
  readonly metrics?: { [index: string]: MetricConfiguration };
}

export interface QueryWithPrecision {
  readonly queryPrecision?: QueryPrecision;
}

export interface QueryableTag {
  readonly name: string;
}

export interface RawEvent extends Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly end?: number;
  readonly entityId?: string;
  readonly entityType?: EntityType;
  readonly id?: string;
  readonly metricAccessId?: string;
  readonly severity: number;
  readonly start: number;
  readonly state?: string;
  readonly title?: string;
  readonly triggeringTime: number;
  readonly type?: string;
}

export interface RawEventInTimeframe {
  readonly id?: string;
  readonly type?: EventTypes;
}

export interface References {
  readonly applications: Application[];
  readonly endpoints: EndpointInfo[];
  readonly infrastructureEntities: SnapshotPreview[];
  readonly services: ServiceLabel[];
  readonly timeConfig?: TimeConfig;
  readonly traceIds: string[];
}

export interface RelatedPluginItem {
  readonly pluginId?: string;
  readonly topSnapshots?: PaginatedRelatedSnapshots;
}

export interface Release {
  readonly applications?: ApplicationScope[];
  readonly name: string;
  readonly services?: ServiceScope[];
  readonly start: number;
}

export interface ReleaseCluster {
  readonly clusteredReleases?: ReleaseWithId[];
  readonly timestamp: number;
}

export interface ReleaseScope {
  readonly applicationId?: string;
  readonly applicationName?: string;
  readonly serviceId?: string;
  readonly serviceName?: string;
}

export interface ReleaseWithId {
  readonly applications?: ApplicationScopeWithId[];
  readonly id: string;
  readonly lastUpdated: number;
  readonly name: string;
  readonly scopes?: ReleaseScope[];
  readonly services?: ServiceScopeWithId[];
  readonly start: number;
}

export interface ReleaseWithIdInternal extends ReleaseWithId {
}

export interface RequestImpactApplicationTimeThreshold extends ApplicationTimeThreshold {
  readonly requests: number;
}

export interface RequestQuoteQuery {
  readonly billingCity: string;
  readonly billingCountry: string;
  readonly billingState: string;
  readonly billingStreet: string;
  readonly billingZip: string;
  readonly companyName: string;
  readonly numberOfApmHosts: number;
  readonly numberOfInfrastructureHosts: number;
  readonly numberOfYears: number;
}

export interface Result<T> {
  readonly adjustedWindowSize?: number;
  readonly data?: T;
  readonly errors: Error[];
  readonly progress: Progress;
  readonly time?: number;
}

export interface Service {
  readonly entityType?: UiEntityType;
  readonly id: string;
  readonly label: string;
  readonly technologies: string[];
  readonly types: EndpointType[];
}

export interface ServiceCursorPaginatedItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly metrics: { [index: string]: number[][] };
  readonly service: Service;
}

export interface ServiceFlowTraversalConfig {
  readonly byMetric?: string;
  readonly maxDepth?: number;
}

export interface ServiceItem extends Metricific {
  readonly metrics: { [index: string]: number[][] };
  readonly service: Service;
}

export interface ServiceLabel {
  readonly id: string;
  readonly label: string;
}

export interface ServiceLink {
  readonly id: string;
  readonly label: string;
  readonly metrics: { [index: string]: number[][] };
  readonly types: EndpointType[];
}

export interface ServiceMap {
  readonly connections: ServiceMapConnection[];
  readonly services: ServiceMapService[];
}

export interface ServiceMapConnection {
  readonly calls: number;
  readonly errorRate: number;
  readonly from: string;
  readonly latency: number;
  readonly to: string;
}

export interface ServiceMapService extends Service {
  readonly applications: string[];
  readonly maxSeverity: number;
  readonly numberOfOpenIssues: number;
}

export interface ServiceNode {
  readonly endpoints: { [index: string]: EndpointNode };
  readonly inclusive: boolean;
  readonly serviceId: string;
}

export interface ServicePreviewItem {
  readonly id: string;
  readonly label: string;
}

export interface ServiceQueryConstants {
}

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

export interface ServiceStackItem extends Item {
  readonly endpointTypes?: string[];
  readonly technologies?: string[];
}

export interface SliConfigMetricConfiguration {
  readonly metricAggregation?: AggregationType;
  readonly metricName: string;
  readonly threshold: number;
}

export interface SliConfiguration {
  readonly id: string;
  readonly initialEvaluationTimestamp: number;
  readonly metricConfiguration?: SliConfigMetricConfiguration;
  readonly sliEntity: SliEntity;
  readonly sliName: string;
}

export interface SliConfigurationWithLastUpdated extends SliConfiguration {
  readonly lastUpdated: number;
}

export interface SliEntity {
  readonly sliType: string;
}

export interface SliMetricConfiguration extends UnifiedMetricConfiguration {
  readonly sliConfigId: string;
  readonly slo: number;
}

export interface SlownessApplicationAlertRule extends ApplicationAlertRule {
  readonly aggregation: AggregationType;
}

export interface SlownessWebsiteAlertRule extends WebsiteAlertRule {
  readonly aggregation: AggregationType;
}

export interface Snapshot {
  readonly data?: { [index: string]: any };
  readonly dependencies?: Dependency[];
  readonly entityId?: EntityId;
  readonly from: number;
  readonly host_id?: string;
  readonly id?: string;
  readonly label?: string;
  readonly metricIds?: string[];
  readonly metric_ids?: string[];
  readonly plugin?: string;
  readonly plugin_id?: string;
  readonly processorTags?: string[];
  readonly processor_tags?: string[];
  readonly steady_id?: string;
  readonly timestamp: number;
  readonly to?: number;
  readonly volatileId?: VolatileId;
  readonly volatile_id?: VolatileId;
}

export interface SnapshotItem {
  readonly id?: string;
  readonly metrics?: { [index: string]: number[][] };
  readonly time: number;
}

export interface SnapshotPreview {
  readonly data?: { [index: string]: any };
  readonly id: string;
  readonly label?: string;
  readonly plugin?: string;
  readonly time: number;
}

export interface Span {
  readonly batchSelfTime?: number;
  readonly batchSize: number;
  readonly calculatedSelfTime: number;
  readonly callId: string;
  readonly childSpans: Span[];
  readonly data: { [index: string]: any };
  readonly destination?: SpanRelation;
  readonly duration: number;
  readonly errorCount: number;
  readonly foreignParentId?: string;
  readonly id: string;
  readonly isSynthetic: boolean;
  readonly kind: SpanKind;
  readonly label: string;
  readonly name: string;
  readonly parentId?: string;
  readonly source?: SpanRelation;
  readonly stackTrace: StackTraceItem[];
  readonly start: number;
}

export interface SpanExcerpt {
  readonly data: { [index: string]: any };
  readonly duration: number;
  readonly errorCount: number;
  readonly foreignParentId?: string;
  readonly kind: SpanKind;
  readonly name: string;
  readonly stackTrace: StackTraceItem[];
  readonly start: number;
}

export interface SpanRelation {
  readonly applications: Application[];
  readonly endpoint?: Endpoint;
  readonly physicalContext?: PhysicalContext;
  readonly service?: Service;
}

export interface SpecificJsErrorsWebsiteAlertRule extends WebsiteAlertRule {
  readonly operator: TagFilterOperator;
  readonly value?: string;
}

export interface Stack {
  readonly application: DomainSpecificStack;
  readonly healthInfo?: HealthInfo;
  readonly infrastructure: DomainSpecificStack;
  readonly kubernetes?: DomainSpecificStack;
}

export interface StackTraceItem {
  readonly file?: string;
  readonly line?: string;
  readonly method?: string;
}

export interface StackTraceLine {
  readonly column: number;
  readonly file: string;
  readonly line: number;
  readonly name?: string;
  readonly translationExplanation?: string;
  readonly translationStatus: number;
}

export interface StaticStringField extends CustomPayloadField {
  readonly value: string;
}

export interface StaticThresholdConfig extends ThresholdConfig {
  readonly lastUpdated: number;
  readonly value: number;
}

export interface StaticThresholdData extends ThresholdData {
  readonly value: number;
}

export interface StaticThresholdSuggestionResponse extends ThresholdSuggestionResponse {
  readonly value: number;
}

export interface StatusCodeApplicationAlertRule extends ApplicationAlertRule {
  readonly statusCodeEnd: number;
  readonly statusCodeStart: number;
}

export interface StatusCodeWebsiteAlertRule extends WebsiteAlertRule {
  readonly operator: TagFilterOperator;
  readonly value: string;
}

export interface SystemRule extends AbstractRule {
  readonly systemRuleId: string;
}

export interface SystemRuleLabel {
  readonly id: string;
  readonly name: string;
}

export interface SystemRules {
}

export interface Tag {
  readonly canApplyToDestination: boolean;
  readonly canApplyToSource: boolean;
  readonly category?: string;
  readonly name?: string;
  readonly sourceValueAvailableFrom: number;
  readonly type?: TagType;
}

export interface TagAvailability {
  readonly availableFrom: number;
}

export interface TagCatalog {
  readonly tagTree: TagTreeLevel[];
  readonly tags: ApiTag[];
}

export interface TagFilter extends TagFilterExpressionElement {
  readonly booleanValue?: boolean;
  readonly entity: TagFilterEntity;
  readonly key?: string;
  readonly name: string;
  readonly numberValue?: number;
  readonly operator: TagFilterOperator;
  readonly stringValue?: string;
  readonly value?: any;
}

export interface TagFilterExpression extends TagFilterExpressionElement {
  readonly elements: TagFilterExpressionElement[];
  readonly logicalOperator: LogicalOperator;
}

export interface TagFilterExpressionElement {
  readonly type: string;
}

export interface TagSetFilter {
  readonly tagFilterExpression: TagFilterExpressionElement;
  readonly timeConfig: TimeConfig;
}

export interface TagSuggestion {
  readonly label: string;
  readonly metrics: { [index: string]: number[][] };
}

export interface TagSuggestions {
  readonly results: TagSuggestion[];
  readonly suggestions: string[];
  readonly totalHits: number;
}

export interface TagTreeLevel extends TagTreeNode {
  readonly children: TagTreeNodeUnion[];
  readonly description?: string;
  readonly label: string;
  readonly queryable: boolean;
  readonly type: 'LEVEL';
}

export interface TagTreeNode {
  readonly icon?: string;
  readonly label?: string;
  readonly type: 'LEVEL' | 'TAG';
}

export interface TagTreeTag extends TagTreeNode {
  readonly description?: string;
  readonly hidden?: boolean;
  readonly label: string;
  readonly queryable?: boolean;
  readonly tagName: string;
  readonly type: 'TAG';
}

export interface TenantConfig {
  readonly environment?: string;
  readonly tenant?: string;
  readonly unit?: string;
}

export interface TenantHealthDownstreamValue {
  readonly healthDownstreamValue?: HealthDownstreamValue;
  readonly tenantConfig?: TenantConfig;
}

export interface ThresholdBounds {
  readonly empty: boolean;
  readonly operator: ThresholdOperator;
  readonly value: number;
}

export interface ThresholdConfig {
  readonly operator: ThresholdOperator;
  readonly type: string;
}

export interface ThresholdData {
  readonly operator: ThresholdOperator;
  readonly type: string;
}

export interface ThresholdRule extends AbstractRule {
  readonly aggregation?: AlertingAggregation;
  readonly conditionOperator: AlertingConditionOperator;
  readonly conditionValue: number;
  readonly metricName?: string;
  readonly metricPattern?: MetricPattern;
  readonly rollup: number;
  readonly window: number;
}

export interface ThresholdRuleWithMetricInfo extends ThresholdRule {
  readonly metricFormat?: Formatter;
  readonly metricLabel?: string;
}

export interface ThresholdSuggestionQuery {
  readonly fallbackOnError: boolean;
  readonly metric?: MetricConfiguration;
  readonly operator?: ThresholdOperator;
  readonly seasonality?: Seasonality;
  readonly type?: ThresholdType;
}

export interface ThresholdSuggestionResponse {
  readonly type?: ThresholdType;
}

export interface ThroughputApplicationAlertRule extends ApplicationAlertRule {
}

export interface ThroughputWebsiteAlertRule extends WebsiteAlertRule {
}

export interface TimeBucket {
  readonly from: number;
  readonly latencyBuckets: LatencyBucket[];
  readonly to: number;
}

export interface TimeShift {
  readonly offset: number;
}

export interface TimeThreshold {
  readonly timeWindow: number;
}

export interface Timeframe {
  readonly from: number;
  readonly fromAsDate?: Date;
  readonly to?: number;
  readonly toAsDate?: Date;
  readonly toOrNow: number;
  readonly windowSize: number;
}

export interface TopListQuery extends FilteredQuery {
  readonly metric?: MetricConfiguration;
}

export interface Trace {
  readonly duration: number;
  readonly endpoint?: Endpoint;
  readonly erroneous: boolean;
  readonly id: string;
  readonly label: string;
  readonly service?: Service;
  readonly startTime: number;
}

export interface TraceActivityTreeNode {
  readonly batchSelfTime?: number;
  readonly batchSize: number;
  readonly children: TraceActivityTreeNode[];
  readonly duration: number;
  readonly endpoint: Endpoint;
  readonly errorCount: number;
  readonly id: string;
  readonly kind: string;
  readonly label: string;
  readonly minSelfTime?: number;
  readonly model: SpanModel;
  readonly networkTime?: number;
  readonly service: Service;
  readonly start: number;
}

export interface TraceActivityTreeNodeDetails {
  readonly batchSelfTime?: number;
  readonly batchSize: number;
  readonly destination?: SpanRelation;
  readonly duration: number;
  readonly errorCount: number;
  readonly id: string;
  readonly isSynthetic: boolean;
  readonly label: string;
  readonly logs: SpanExcerpt[];
  readonly minSelfTime?: number;
  readonly networkTime?: number;
  readonly source?: SpanRelation;
  readonly spans: SpanExcerpt[];
  readonly start: number;
  readonly synthetic: boolean;
}

export interface TraceGroupsItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly metrics: { [index: string]: number[][] };
  readonly name: string;
  readonly timestamp: number;
}

export interface TraceItem extends Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly trace: Trace;
}

export interface TraceParticipant {
  readonly aggregatedTime: number;
  readonly callCount: number;
  readonly endpoint: Endpoint;
  readonly errorCount: number;
  readonly service: Service;
}

export interface TraceSummary {
  readonly callCount: number;
  readonly callCountIgnoringBatchSize: number;
  readonly callRecordCount: number;
  readonly duration: number;
  readonly eumCorrelationId?: string;
  readonly eumCorrelationType?: string;
  readonly id: string;
  readonly ingestionBatchesCount: number;
  readonly issues: string[];
  readonly label: string;
  readonly startTime: number;
  readonly technologies: string[];
  readonly totalErrorCount: number;
  readonly totalErrorLogCount: number;
  readonly totalWarnLogCount: number;
  readonly type: EndpointType;
}

export interface TraceViewedEvent extends UiQuery {
  readonly traceId: string;
}

export interface TreeMap {
  readonly root?: TreeMapNode<any>;
}

export interface TreeMapNode<T> {
  readonly children?: TreeMapNode<any>[];
  readonly id: string;
  readonly label?: string;
}

export interface UiQuery {
}

export interface UnifiedMetricConfiguration {
  readonly aggregation: AggregationType;
  readonly granularity?: number;
  readonly metric: string;
  readonly resultType: ResultType;
  readonly source: MetricSource;
  readonly timeConfig: TimeConfig;
  readonly timeShift: TimeShift;
}

export interface UnsupportedMetricSource extends UnifiedMetricConfiguration {
}

export interface UsageMetricConfiguration extends UnifiedMetricConfiguration {
  readonly showAggregatedMetrics: boolean;
  readonly tenant?: string;
  readonly unit?: string;
}

export interface UserImpactThreshold {
  readonly userPercentage?: number;
  readonly users?: number;
}

export interface UserImpactWebsiteTimeThreshold extends WebsiteTimeThreshold, UserImpactThreshold {
}

export interface UserResult {
  readonly email: string;
  readonly fullName: string;
  readonly id: string;
  readonly lastLoggedIn?: number;
}

export interface ValidatedAlertingChannelInputInfo extends AlertingChannelInputInfo {
  readonly invalid: boolean;
}

export interface ValidatedAlertingConfiguration extends AlertingConfigurationWithLastUpdated {
  readonly alertChannelNames?: string[];
  readonly applicationNames?: string[];
  readonly invalid: boolean;
}

export interface ValidatedMaintenanceConfigWithStatus extends MaintenanceConfigWithStatus {
  readonly invalid: boolean;
}

export interface VersionedConfig {
  readonly created: number;
  readonly enabled: boolean;
  readonly id?: string;
  readonly readOnly: boolean;
}

export interface ViolationsInPeriodApplicationTimeThreshold extends ApplicationTimeThreshold {
  readonly violations: number;
}

export interface ViolationsInPeriodWebsiteTimeThreshold extends WebsiteTimeThreshold {
  readonly violations: number;
}

export interface ViolationsInSequenceApplicationTimeThreshold extends ApplicationTimeThreshold {
}

export interface ViolationsInSequenceWebsiteTimeThreshold extends WebsiteTimeThreshold {
}

export interface VolatileId {
  readonly entity_id?: string;
  readonly host_id?: string;
  readonly sensor_name?: string;
}

export interface VshphereDatacenterItem {
  readonly configStatus: string;
  readonly datacenterId: string;
  readonly entityHealthInfo?: EntityHealthInfo;
  readonly hosts: number;
  readonly id: string;
  readonly label: string;
  readonly name: string;
  readonly overallStatus: string;
  readonly type: string;
  readonly vms: number;
}

export interface VshphereHostItem {
  readonly configStatus: number;
  readonly cpuTotal: number;
  readonly datacenterId?: string;
  readonly datastores?: VsphereDatastore[];
  readonly hostId: string;
  readonly id: string;
  readonly label: string;
  readonly memoryTotal: number;
  readonly name: string;
  readonly overallStatus: string;
  readonly type: number;
  readonly vms: number;
}

export interface VshphereVmItem {
  readonly configStatus: number;
  readonly cpuTotal: number;
  readonly guestFullName?: string;
  readonly guestState?: string;
  readonly hostId: string;
  readonly id: string;
  readonly label: string;
  readonly memoryTotal: number;
  readonly type: number;
}

export interface VsphereDatacenterItemCounters extends FilterableListItem {
  readonly datacenterId: string;
  readonly hosts: number;
  readonly id: string;
  readonly label: string;
  readonly vms: number;
}

export interface VsphereDatastore {
  readonly capacity?: number;
  readonly freeSpace?: number;
  readonly id?: string;
  readonly label: string;
  readonly maxFileSize?: number;
  readonly type?: string;
  readonly url?: string;
}

export interface VsphereHost {
  readonly cpuAllocation?: number;
  readonly cpuUsage?: number;
  readonly datacenterName: string;
  readonly datastores?: VsphereDatastore[];
  readonly id: string;
  readonly label: string;
  readonly memoryAllocation?: number;
  readonly memoryUsage?: number;
}

export interface VsphereHostListItem extends FilterableListItem, ListItemWithMetric {
  readonly cpuTotal: number;
  readonly datacenterId?: string;
  readonly id: string;
  readonly label: string;
  readonly memTotal: number;
  readonly vms: number;
}

export interface VsphereInfrastructureLink extends FilterableListItem {
  readonly id: string;
  readonly label: string;
}

export interface VsphereQueryFilter extends FilterInterface {
  readonly datacenterId?: string;
  readonly hostId?: string;
  readonly label?: string;
  readonly snapshotId?: string;
  readonly timeConfig: TimeConfig;
  readonly vmId?: string;
}

export interface VsphereVmListItem extends FilterableListItem, ListItemWithMetric {
  readonly cpuTotal: number;
  readonly datacenterId?: string;
  readonly guestFullName?: string;
  readonly hostId?: string;
  readonly id: string;
  readonly label: string;
  readonly memTotal: number;
}

export interface WebBrowser {
  readonly name: string;
  readonly version?: string;
}

export interface Website {
  readonly id: string;
  readonly label: string;
}

export interface WebsiteAlertConfig {
  readonly alertChannelIds: string[];
  readonly customPayloadFields: StaticStringField[];
  readonly description: string;
  readonly granularity?: Granularity;
  readonly name: string;
  readonly rule: WebsiteAlertRule;
  readonly severity: number;
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
  readonly threshold: ThresholdConfig;
  readonly timeThreshold: WebsiteTimeThreshold;
  readonly triggering: boolean;
  readonly websiteId: string;
}

export interface WebsiteAlertConfigWithMetadata extends WebsiteAlertConfig, VersionedConfig {
  readonly id: string;
}

export interface WebsiteAlertRule extends AlertRule {
  readonly alertType: string;
}

export interface WebsiteAlertStats {
  readonly websiteAlerts: number;
  readonly websites: number;
}

export interface WebsiteBeaconGroupsItem extends Metricific, Cursorific<IngestionOffsetCursor> {
  readonly cursor: IngestionOffsetCursor;
  readonly earliestTimestamp: number;
  readonly metrics: { [index: string]: number[][] };
  readonly name: string;
}

export interface WebsiteBeaconTagGroup extends Group {
}

export interface WebsiteBeaconsItem extends Cursorific<IngestionOffsetCursor> {
  readonly beacon: WebsiteMonitoringBeacon;
  readonly cursor: IngestionOffsetCursor;
}

export interface WebsiteCountryBreakdown {
  readonly continent: string;
  readonly continentCode: string;
  readonly country: string;
  readonly countryCode: string;
  readonly onLoadTime: number;
  readonly pageLoads: number;
}

export interface WebsiteErrorsItem {
  readonly error: JavaScriptError;
  readonly metrics: { [index: string]: number[][] };
}

export interface WebsiteItem {
  readonly healthInfo?: EntityHealthInfo;
  readonly metrics: { [index: string]: number[][] };
  readonly website: Website;
}

export interface WebsiteMetricConfiguration extends UnifiedMetricConfiguration {
  readonly beaconType?: string;
  readonly grouping?: Grouping[];
  readonly tagFilterExpression?: TagFilterExpressionElement;
  readonly tagFilters?: TagFilter[];
}

export interface WebsiteMonitoringBeacon {
  readonly accuracyRadius?: number;
  readonly accurateTimingsAvailable?: boolean;
  readonly appCacheTime?: number;
  readonly backendTime?: number;
  readonly backendTraceId?: string;
  readonly batchSize?: number;
  readonly beaconId: string;
  readonly browserName?: string;
  readonly browserVersion?: string;
  readonly cacheInteraction?: string;
  readonly childrenTime?: number;
  readonly city?: string;
  readonly clockSkew?: number;
  readonly componentStack?: string;
  readonly connectionType?: string;
  readonly continent?: string;
  readonly continentCode?: string;
  readonly country?: string;
  readonly countryCode?: string;
  readonly cspBlockedUri?: string;
  readonly cspColumnNumber?: number;
  readonly cspDisposition?: string;
  readonly cspEffectiveDirective?: string;
  readonly cspLineNumber?: number;
  readonly cspOriginalPolicy?: string;
  readonly cspSample?: string;
  readonly cspSourceFile?: string;
  readonly cumulativeLayoutShift: number;
  readonly customEventName?: string;
  readonly decodedBodySize?: number;
  readonly deprecations?: string[];
  readonly deviceType?: string;
  readonly dnsTime?: number;
  readonly domTime?: number;
  readonly duration?: number;
  readonly encodedBodySize?: number;
  readonly errorCount?: number;
  readonly errorId?: string;
  readonly errorMessage?: string;
  readonly errorType?: string;
  readonly firstContentfulPaintTime?: number;
  readonly firstInputDelayTime: number;
  readonly firstPaintTime?: number;
  readonly frontendTime?: number;
  readonly graphqlOperationName?: string;
  readonly graphqlOperationType?: string;
  readonly httpCallAsynchronous?: boolean;
  readonly httpCallCorrelationAttempted?: boolean;
  readonly httpCallMethod?: string;
  readonly httpCallOrigin?: string;
  readonly httpCallPath?: string;
  readonly httpCallStatus?: number;
  readonly httpCallUrl?: string;
  readonly initiator?: string;
  readonly largestContentfulPaintTime: number;
  readonly latitude?: number;
  readonly locationOrigin: string;
  readonly locationPath?: string;
  readonly locationUrl: string;
  readonly longitude?: number;
  readonly meta?: { [index: string]: string };
  readonly onLoadTime?: number;
  readonly osName?: string;
  readonly osVersion?: string;
  readonly page?: string;
  readonly pageLoadId: string;
  readonly parsedStackTrace?: StackTraceLine[];
  readonly phase?: string;
  readonly processingTime?: number;
  readonly redirectTime?: number;
  readonly requestTime?: number;
  readonly resourceType?: string;
  readonly responseTime?: number;
  readonly sessionId?: string;
  readonly snippetVersion?: string;
  readonly sslTime?: number;
  readonly stackTrace?: string;
  readonly stackTraceParsingStatus: number;
  readonly stackTraceReadability: number;
  readonly subdivision?: string;
  readonly subdivisionCode?: string;
  readonly tcpTime?: number;
  readonly timestamp?: number;
  readonly transferSize?: number;
  readonly type: string;
  readonly unloadTime?: number;
  readonly userEmail?: string;
  readonly userId?: string;
  readonly userIp?: string;
  readonly userLanguages?: string[];
  readonly userName?: string;
  readonly websiteId: string;
  readonly websiteLabel: string;
  readonly windowHeight?: number;
  readonly windowHidden?: boolean;
  readonly windowWidth?: number;
}

export interface WebsiteMonitoringMetricDescription extends MetricDescription {
  readonly beaconTypes: string[];
  readonly pathToValueInBeacon?: string[];
  readonly tagName?: string;
}

export interface WebsiteMonitoringMetricsConfiguration extends MetricConfiguration {
}

export interface WebsitePaginatedBeaconGroupsItem {
  readonly earliestTimestamp: number;
  readonly metrics: { [index: string]: number[][] };
  readonly name: string;
}

export interface WebsiteRateMetricConfiguration extends WebsiteMonitoringMetricsConfiguration {
  readonly numeratorFilter?: TagFilter;
}

export interface WebsiteSubdivisionsItem {
  readonly continent: string;
  readonly continentCode: string;
  readonly country: string;
  readonly countryCode: string;
  readonly metrics: { [index: string]: number[][] };
  readonly subdivision: string;
  readonly subdivisionCode?: string;
}

export interface WebsiteTimeThreshold extends TimeThreshold {
  readonly type: string;
}

export interface WebsiteWebBrowsersItem {
  readonly metrics: { [index: string]: number[][] };
  readonly webBrowser: WebBrowser;
}

export interface Widget {
  readonly config: any;
  readonly height: number;
  readonly id: string;
  readonly title?: string;
  readonly type: string;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export interface WindowWidthBreakdown {
  readonly maxWindowWidth: number;
  readonly minWindowWidth: number;
  readonly pageLoads: number;
  readonly users: number;
}

export interface WorkloadCounters {
  readonly daemonSets: number;
  readonly deploymentConfigs: number;
  readonly deployments: number;
  readonly pods: number;
  readonly statefulSets: number;
}

export type AccessRuleRelationType = 'USER' | 'API_TOKEN' | 'ROLE' | 'TEAM' | 'GLOBAL';

export type AccessType = 'READ' | 'READ_WRITE';

export type AgentMonitoringIssueCategory = 'SENSOR' | 'TRACER' | 'PROFILER' | 'UNKNOWN';

export type AggregationType = 'SUM' | 'MEAN' | 'MAX' | 'MIN' | 'P25' | 'P50' | 'P75' | 'P90' | 'P95' | 'P98' | 'P99' | 'P99_9' | 'P99_99' | 'DISTINCT_COUNT' | 'SUM_POSITIVE';

export type AlertEvaluationType = 'PER_AP' | 'PER_AP_SERVICE' | 'PER_AP_ENDPOINT';

export type AlertType = 'Alert' | 'WebsiteSmartAlert' | 'ApplicationSmartAlert' | 'GlobalApplicationSmartAlert';

export type AlertingAggregation = 'sum' | 'avg' | 'min' | 'max';

export type AlertingApplicationBoundaryScope = 'ALL' | 'INBOUND';

export type AlertingConditionOperator = '>' | '>=' | '<' | '<=' | '=' | '!=';

export type AlertingEventTypes = 'incident' | 'critical' | 'warning' | 'change' | 'online' | 'offline' | 'agent_monitoring_issue' | 'none';

export type AlertingMatchingOperator = 'is' | 'contains' | 'startsWith' | 'endsWith' | 'any';

export type AlertingStringMatchingOperator = 'is' | 'contains' | 'startsWith' | 'endsWith';

export type ApplicationBoundaryScope = 'ALL' | 'INBOUND';

export type ApplicationDataSource = 'CALLS' | 'TRACES';

export type ApplicationDownstreamScope = 'INCLUDE_NO_DOWNSTREAM' | 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING' | 'INCLUDE_ALL_DOWNSTREAM';

export type AvailabilitySliEventType = 'GOOD' | 'BAD';

export type BreakdownType = 'RESPONSE_TIME' | 'PROCESSING_TIME';

export type CatalogUseCase = 'GROUPING' | 'FILTERING' | 'SMART_ALERTS' | 'SLI_MANAGEMENT' | 'APPLICATION_CONFIG' | 'APPLICATION_CONFIG_BLUEPRINT';

export type ContextScope = 'NONE' | 'UPSTREAM' | 'DOWNSTREAM';

export type DataSource = 'CALLS' | 'TRACES';

export type DependencyType = 'in' | 'is' | 'to' | 'of' | 'connected' | 'describes' | 'of20' | 'to20' | 'dummy' | 'parent';

export type Direction = 'outgoing' | 'incoming';

export type EndpointSyntheticType = 'NON_SYNTHETIC' | 'SYNTHETIC' | 'MIXED';

export type EndpointType = 'UNDEFINED' | 'RPC' | 'EVENT' | 'GRAPHQL' | 'BATCH' | 'SHELL' | 'HTTP' | 'SDK' | 'OPENTELEMETRY' | 'INTERNAL' | 'DATABASE' | 'MESSAGING' | 'PAGE' | 'PAGE_RESOURCE';

export type EntityContextGuideGroup = 'INFRASTRUCTURE_AVAILABILITY_ZONE' | 'INFRASTRUCTURE_CLUSTER' | 'INFRASTRUCTURE_CLUSTER_NODE' | 'INFRASTRUCTURE_HARDWARE' | 'INFRASTRUCTURE_HOST' | 'INFRASTRUCTURE_CONTAINER' | 'INFRASTRUCTURE_PROCESS' | 'INFRASTRUCTURE_PROCESS_TECHNOLOGY' | 'INFRASTRUCTURE_PROCESS_APPLICATION' | 'APPLICATION_PERSPECTIVE' | 'APPLICATION_SERVICE' | 'APPLICATION_ENDPOINT' | 'KUBERNETES_CLUSTER' | 'KUBERNETES_NODE' | 'KUBERNETES_NAMESPACE' | 'KUBERNETES_WORKLOAD_CONTROLLER' | 'KUBERNETES_SERVICE' | 'KUBERNETES_POD' | 'KUBERNETES_REPLICA_SET' | 'KUBERNETES_ENDPOINTS' | 'KUBERNETES_JOB' | 'KUBERNETES_CRONJOB';

export type EntityType = 'Entity10' | 'App20' | 'Service20' | 'Endpoint20' | 'Website';

export type ErrorCode = 'NOT_FOUND' | 'VALIDATION' | 'AUTH' | 'TOO_MANY_REQUESTS' | 'CLIENT' | 'SERVER' | 'UNAVAILABLE' | 'GATEWAY_TIMEOUT' | 'TIMEOUT';

export type EventSpecificationType = 'BUILT_IN' | 'CUSTOM';

export type EventTypes = 'INCIDENT' | 'ISSUE' | 'CHANGE' | 'OBJECTIVE' | 'AGENT_MONITORING_ISSUE';

export type FlowDirection = 'INCOMING' | 'OUTGOING';

export type Formatter = 'NUMBER' | 'BYTES' | 'PERCENTAGE' | 'LATENCY' | 'MILLIS' | 'SECONDS' | 'MICROS' | 'RATE' | 'BYTE_RATE' | 'UNDEFINED';

export type Granularity = 60000 | 300000 | 600000 | 900000 | 1200000 | 1800000;

export type InfraTabCategory = 'HOST' | 'CONTAINER' | 'PROCESS' | 'CLUSTER';

export type InfraTagCategory = 'OTHERS' | 'KUBERNETES' | 'CLOUD_FOUNDRY' | 'VSHPERE' | 'AWS' | 'AZURE' | 'GCP' | 'CONTAINER' | 'SELF_MONITORING' | 'IBM_CLOUD' | 'IBM_DATAPOWER' | 'IBM_I_SERIES' | 'IBM_MQ' | 'CLR' | 'ACE' | 'CASSANDRA' | 'COCKROACH' | 'CONSUL' | 'COUCHBASE' | 'ELASTICSEARCH' | 'HADOOP_YARN' | 'HAZELCAST' | 'KAFKA_CONNECT' | 'MONGO_DB' | 'REDIS' | 'SOLR' | 'SPARK';

export type KubernetesClusterManagementType = 'RANCHER' | 'PKS' | 'NONE';

export type KubernetesTreemapGrouping = 'DEPLOYMENT' | 'NAMESPACE' | 'SERVICE' | 'NODE';

export type Level = 'APP' | 'APP_SERVICE' | 'APP_SERVICE_ENDPOINT';

export type LogLevel = 'WARN' | 'ERROR';

export type LogicalOperator = 'AND' | 'OR';

export type LogsApplicationAlertRuleLogLevel = 'WARN' | 'ERROR' | 'ANY';

export type MaintenanceStatus = 'UNSCHEDULED' | 'SCHEDULED' | 'ACTIVE' | 'FINISHED';

export type MetricDataSource = 'CALLS' | 'TRACES';

export type MetricSource = 'INFRASTRUCTURE_METRICS' | 'INFRASTRUCTURE' | 'APPLICATION' | 'WEBSITE' | 'MOBILE_APP' | 'EVENT' | 'SLI' | 'USAGE' | 'DISTRIBUTED_LOGS' | 'DISTRIBUTED_LOGS_V2' | 'UNKNOWN';

export type OrderDirection = 'ASC' | 'DESC';

export type QueryPrecision = 'APPROXIMATE' | 'FULL';

export type Relationship = 'CONTAINS' | 'DEFINED_IN' | 'DEPLOYED_ON' | 'DEPLOYED_WITHIN' | 'EXECUTED_BY' | 'EXECUTING' | 'EXPOSED_BY' | 'EXPOSED_THROUGH' | 'EXPOSES' | 'EXPOSING' | 'ORCHESTRATED_IN' | 'ORCHESTRATED_ON' | 'ORCHESTRATING' | 'PART_OF' | 'PROVIDED_BY' | 'PROVIDED_FROM' | 'PROVIDED_ON' | 'PROVIDED_WITHIN' | 'PROVIDES' | 'RUNS' | 'RUNS_IN' | 'RUNS_ON' | 'RUNS_WITHIN' | 'SCHEDULED' | 'SCHEDULED_BY' | 'SCHEDULED_ON' | 'SCHEDULED_WITHIN' | 'SCHEDULES' | 'SCHEDULING_IN' | 'SCHEDULING_ON' | 'SERVED_BY' | 'SERVED_THROUGH' | 'SERVES' | 'SERVES_ON' | 'SERVES_WITHIN' | 'SPANS_ACROSS' | 'WITHIN';

export type ResultType = 'TIME_SERIES' | 'HISTOGRAM' | 'SINGLE_NUMBER';

export type Seasonality = 'WEEKLY' | 'DAILY';

export type SliMetricType = 'SLI' | 'ERROR_BUDGET_SPENT' | 'ERROR_BUDGET_REMAINING' | 'TOTAL_ERROR_BUDGET' | 'HOURLY_ERROR_BUDGET_CHART' | 'CONSUMED_ERROR_BUDGET_CHART';

export type SpanKind = 'UNKNOWN' | 'ENTRY' | 'EXIT' | 'INTERMEDIATE';

export type SpanModel = 'UNKNOWN' | 'HTTP' | 'DATABASE' | 'RPC' | 'MESSAGING' | 'BATCH' | 'LOG' | 'SDK';

export type TagFilterEntity = 'NOT_APPLICABLE' | 'DESTINATION' | 'SOURCE';

export type TagFilterOperator = 'EQUALS' | 'CONTAINS' | 'LESS_THAN' | 'LESS_OR_EQUAL_THAN' | 'GREATER_THAN' | 'GREATER_OR_EQUAL_THAN' | 'NOT_EMPTY' | 'NOT_EQUAL' | 'NOT_CONTAIN' | 'IS_EMPTY' | 'NOT_BLANK' | 'IS_BLANK' | 'STARTS_WITH' | 'ENDS_WITH' | 'NOT_STARTS_WITH' | 'NOT_ENDS_WITH';

export type TagSuggestionProposeType = 'KEYS' | 'VALUES';

export type TagTreeNodeUnion = TagTreeLevel | TagTreeTag;

export type ThresholdOperator = '>' | '>=' | '<' | '<=';

export type ThresholdType = 'staticThreshold' | 'historicBaseline' | 'adaptiveBaseline';

export type Type = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'UNKNOWN';

export type UiEntityType = 'APPLICATION' | 'SERVICE' | 'ENDPOINT';
