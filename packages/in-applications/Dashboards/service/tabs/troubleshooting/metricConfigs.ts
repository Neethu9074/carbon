/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { Group, TagFilter, TagFilterExpression } from 'in-types';

export const createServiceIdTagFilter = (serviceId: string): TagFilter => {
  return tagFilter('service.id', EQUALS, serviceId);
};
export const createServiceNameTagFilter = (serviceName: string): TagFilter => {
  return tagFilter('service.name', EQUALS, serviceName, null, DESTINATION);
};
export const qualifiedReferencesFilter: TagFilter = tagFilter(
  'call.meta_tags',
  EQUALS,
  'QUALIFIED_REFERENCE',
  'destination_infra_reference_type'
);

export const createTagFilterExpression = (serviceId: string, ...otherFilters: TagFilter[]): TagFilterExpression => {
  return {
    elements: [createServiceIdTagFilter(serviceId), ...otherFilters],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };
};

function getDefaultMetricConfig(serviceId: string): Metric {
  return {
    metric: 'calls',
    aggregation: 'SUM',
    source: 'APPLICATION',
    tagFilterExpression: createTagFilterExpression(serviceId)
  };
}

export const groupByServiceMappingOutcome: Group = {
  groupbyTag: 'call.meta_tags',
  groupbyTagSecondLevelKey: 'destination_service_mapping_outcome_detail'
} as Group;
export function getServiceMappingMetricConfig(serviceId: string): Metric {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByServiceMappingOutcome,
        direction: 'DESC',
        maxResults: 20,
        includeOthers: false,
        includeUnmatched: false
      }
    ]
  };
}

export const groupByInfraLinkingOutcome: Group = {
  groupbyTag: 'call.meta_tags',
  groupbyTagSecondLevelKey: 'destination_infra_detection_detail'
} as Group;
export function getInfraLinkingMetricConfig(serviceId: string): Metric {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByInfraLinkingOutcome,
        direction: 'DESC',
        maxResults: 20,
        includeOthers: false,
        includeUnmatched: false
      }
    ]
  };
}

export const groupByHostname: Group = {
  groupbyTag: 'host.name',
  groupbyTagEntity: DESTINATION
} as Group;
export function getGroupByHostnameConfig(serviceId: string): Metric {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByHostname,
        direction: 'DESC',
        maxResults: 20,
        includeOthers: false,
        includeUnmatched: false
      }
    ]
  };
}

export const groupByHttpHost: Group = {
  groupbyTag: 'call.http.host'
} as Group;
export function getGroupByHttpHostConfig(serviceId: string): Metric {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByHttpHost,
        direction: 'DESC',
        maxResults: 20,
        includeOthers: false,
        includeUnmatched: false
      }
    ]
  };
}

export const groupByInfraReferenceType: Group = {
  groupbyTag: 'call.meta_tags',
  groupbyTagSecondLevelKey: 'destination_infra_reference_type'
} as Group;
export function getInfraReferenceTypeMetricConfig(serviceId: string): Metric {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByInfraReferenceType,
        direction: 'DESC',
        maxResults: 20,
        includeOthers: false,
        includeUnmatched: false
      }
    ]
  };
}

export const groupBySpanType: Group = {
  groupbyTag: 'call.span_type'
} as Group;
export function getGroupBySpanType(serviceId: string): Metric {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupBySpanType,
        direction: 'DESC',
        maxResults: 20,
        includeOthers: false,
        includeUnmatched: false
      }
    ]
  };
}

export const groupByProcessUptime: Group = {
  groupbyTag: 'call.meta_tags',
  groupbyTagSecondLevelKey: 'destination_process_uptime'
} as Group;
export function getGroupByProcessUptime(serviceId: string): Metric {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByProcessUptime,
        direction: 'DESC',
        maxResults: 20,
        includeOthers: false,
        includeUnmatched: false
      }
    ]
  };
}

export const groupByServiceRuleId: Group = {
  groupbyTag: 'service.rule_id',
  groupbyTagEntity: DESTINATION
} as Group;
export function getGroupByServiceRuleId(serviceId: string): Metric {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByServiceRuleId,
        direction: 'DESC',
        maxResults: 20,
        includeOthers: false,
        includeUnmatched: false
      }
    ]
  };
}

export type MetricConfig = ReturnType<typeof getServiceMappingMetricConfig>;

export const serviceMappingColorMap: Record<string, string> = {
  MANUAL_MAPPING_UNMONITORED_SERVICE: 'lightBlue',
  MANUAL_MAPPING_EXISTING_SERVICE: 'orange',
  RESILIENT_MAPPING_FIRST_LEVEL_CACHE: 'deepPurple',
  RESILIENT_MAPPING_SECOND_LEVEL_CACHE: 'cyan',
  FALLBACK_MAPPING_NO_CACHE_HIT: '#97af20',
  FALLBACK_MAPPING_ENTITY_NOT_TRUSTWORTHY: 'pink',
  FALLBACK_MAPPING_AMBIGUOUS: 'teal',
  FALLBACK_MAPPING_ERROR: 'purple',
  FALLBACK_MAPPING_ENTITY_LOWER_IN_PRIO: 'indigo',
  FALLBACK_MAPPING_NO_CACHE_KEY: '#4596A4',
  REGULAR_MAPPING: 'green',
  MISSING_RULE: 'red'
};
export const serviceMappingColorMapper = (_: string, label: string) => {
  return serviceMappingColorMap[label] ?? null;
};

export const infraLinkingColorMap: Record<string, string> = {
  PARTIAL_PROCESS_ON_HOST_MISSING: 'lightBlue',
  PARTIAL_SPECIFIC_PROCESS_MISSING: 'orange',
  PARTIAL_APP_SERVER_MISSING_ON_JVM: 'deepPurple',
  PARTIAL_CONTAINER_MISSING: 'cyan',
  PARTIAL_K8S_INFRA_MISSING: '#97af20',
  PARTIAL_PCF_INFRA_MISSING: 'pink',
  PARTIAL_EC2_INSTANCE_MISSING: 'teal',
  PARTIAL_ECS_TASK_MISSING: 'purple',
  FULL: 'green',
  NONE_AMBIGUOUS_INFRA_REF: '#4596A4',
  NONE: 'red'
};
export const infraLinkingColorMapper = (_: string, label: string) => {
  return infraLinkingColorMap[label] ?? null;
};

export const infraReferenceColorMap: Record<string, string> = {
  UNQUALIFIED_REFERENCE_HOST_AND_PORT: 'lightBlue',
  UNQUALIFIED_REFERENCE_CLUSTER_NAME: 'orange',
  UNQUALIFIED_REFERENCE_CLOUD_ID: 'deepPurple',
  QUALIFIED_REFERENCE: 'green',
  UNKNOWN_REFERENCE: 'red'
};
export const infraReferenceColorMapper = (_: string, label: string) => {
  return infraReferenceColorMap[label] ?? null;
};
