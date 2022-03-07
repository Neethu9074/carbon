/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { Group } from 'in-types';

export const createServiceTagFilter = (serviceId: string) => {
  return {
    stringValue: serviceId,
    name: 'service.id',
    entity: DESTINATION,
    operator: EQUALS
  };
};
export const createServiceTagFilterExpression = (serviceId: string) => {
  return {
    elements: [createServiceTagFilter(serviceId)],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };
};

const getDefaultMetricConfig = (serviceId: string) => {
  return {
    metric: 'calls',
    aggregation: 'SUM',
    source: 'APPLICATION',
    tagFilterExpression: createServiceTagFilterExpression(serviceId)
  };
};

export const groupByServiceMappingOutcome: Group = {
  groupbyTag: 'call.meta_tags',
  groupbyTagSecondLevelKey: 'destination_service_mapping_outcome_detail'
} as Group;

export const getServiceMappingMetricConfig = (serviceId: string) => {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByServiceMappingOutcome,
        direction: 'DESC',
        maxResults: 20
      }
    ]
  };
};

export const groupByInfraLinkingOutcome: Group = {
  groupbyTag: 'call.meta_tags',
  groupbyTagSecondLevelKey: 'destination_infra_final_detection_detail'
} as Group;

export const getInfraLinkingMetricConfig = (serviceId: string) => {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByInfraLinkingOutcome,
        direction: 'DESC',
        maxResults: 20
      }
    ]
  };
};

export const groupByHostname: Group = {
  groupbyTag: 'host.name',
  groupbyTagEntity: DESTINATION
} as Group;
export const getGroupByHostnameConfig = (serviceId: string) => {
  return {
    ...getDefaultMetricConfig(serviceId),
    metric: 'erroneousCalls',
    grouping: [
      {
        by: groupByHostname,
        direction: 'DESC',
        maxResults: 20
      }
    ]
  };
};

export const groupByHttpHost: Group = {
  groupbyTag: 'call.http.host'
} as Group;
export const getGroupByHttpHostConfig = (serviceId: string) => {
  return {
    ...getDefaultMetricConfig(serviceId),
    metric: 'erroneousCalls',
    grouping: [
      {
        by: groupByHttpHost,
        direction: 'DESC',
        maxResults: 20
      }
    ]
  };
};

export const groupByInfraReferenceType: Group = {
  groupbyTag: 'call.meta_tags',
  groupbyTagSecondLevelKey: 'destination_infra_reference_type'
} as Group;

export const getInfraReferenceTypeMetricConfig = (serviceId: string) => {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByInfraReferenceType,
        direction: 'DESC',
        maxResults: 20
      }
    ]
  };
};

export const groupBySpanType: Group = {
  groupbyTag: 'call.span_type'
} as Group;
export const getGroupBySpanType = (serviceId: string) => {
  return {
    ...getDefaultMetricConfig(serviceId),
    metric: 'erroneousCalls',
    grouping: [
      {
        by: groupBySpanType,
        direction: 'DESC',
        maxResults: 20
      }
    ]
  };
};

export const groupByProcessUptime: Group = {
  groupbyTag: 'call.meta_tags',
  groupbyTagSecondLevelKey: 'destination_process_uptime'
} as Group;

export const getGroupByProcessUptime = (serviceId: string) => {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByProcessUptime,
        direction: 'DESC',
        maxResults: 20
      }
    ]
  };
};

export const groupByServiceRuleId: Group = {
  groupbyTag: 'service.rule_id'
} as Group;
export const getGroupByServiceRuleId = (serviceId: string) => {
  return {
    ...getDefaultMetricConfig(serviceId),
    grouping: [
      {
        by: groupByServiceRuleId,
        direction: 'DESC',
        maxResults: 20
      }
    ]
  };
};
