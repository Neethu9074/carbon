/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  Action,
  VolatileId,
  Event,
  ActionMatch,
  EventSpecificationInfo,
  ActionInstance,
  Policy,
  TagCatalog,
  ParameterValue,
  GetDynamicParameterValues,
  TriggerType,
  SyntheticAlertConfigWithMetadata,
  ServiceLevelsAlertConfigWithMetadata,
  ActionType,
  ActionNameExists,
  ImpactedApplicationDetails,
  ResourceOptimization
} from '@instana/types';

import {
  ApplicationSmartAlertConfigWithMetadata,
  GlobalApplicationsSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import submitTurbonomicResourceImpact from 'in-automation/subscriptions/submitTurbonomicResourceImpact';
import { ActionFilter, NewAction, ResolvedDynamicParamValue, NewPolicy } from 'in-automation/types';
import turboSubmitActionExecution from 'in-automation/subscriptions/turboSubmitActionExecution';
import { baseUrl as apiEndpoint } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import submitActionExecution from 'in-automation/subscriptions/submitActionExecution';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { mapData } from 'in-services/util/result';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

const automationAPIBase = '/api/automation';
const turboAPIBase = '/api/turbonomic';
const actionUrl = `${automationAPIBase}/actions` as const;
const policiesUrl = `${automationAPIBase}/policies` as const;

export function getActions() {
  return http<Action[]>({
    method: 'GET',
    maxRetries: 3,
    url: actionUrl,
    mapToResultObject: true
  });
}

export function getActionTags() {
  return http<{ tags: string[] }>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionUrl}/tags`,
    mapToResultObject: true
  });
}

export function getAllActionsWithAISuggestions(
  name: string,
  description: string,
  targetSnapshotId?: string,
  type?: 'default' | 'watsonx',
  eventId?: string
) {
  return http<ActionMatch[]>({
    method: 'POST',
    maxRetries: 3,
    url: `${automationAPIBase}/ai/action/match`,
    data: {
      name,
      description,
      type,
      eventId
    },
    queryParams: {
      targetSnapshotId: targetSnapshotId ? encodeURIComponent(targetSnapshotId) : undefined
    },
    headers: getCsrfHeader(),
    mapToResultObject: true
  }).map(response =>
    mapData(response, actionMatch =>
      actionMatch.map(({ action, score, confidence, aiEngine, policy }) => ({
        entity: aiEngine === 'POLICY' && policy ? policy : action,
        score,
        confidence,
        aiEngine
      }))
    )
  );
}

export function getResourceOptimization(targetSnapshotId: string, entityType: string | null, actionCategory?: string) {
  return http<ResourceOptimization>({
    method: 'GET',
    maxRetries: 3,
    url: `${turboAPIBase}/recommendedActions`,
    queryParams: {
      targetSnapshotId: encodeURIComponent(targetSnapshotId),
      entityType,
      actionCategory: actionCategory ? actionCategory : undefined
    },
    mapToResultObject: true,
    headers: getCsrfHeader()
  });
}

export function getTurboActionImpactedApplications(targetSnapshotId: string) {
  return http<ImpactedApplicationDetails>({
    method: 'GET',
    maxRetries: 3,
    url: `${turboAPIBase}/impactedApplications`,
    queryParams: {
      targetSnapshotId: encodeURIComponent(targetSnapshotId)
    },
    mapToResultObject: true,
    headers: getCsrfHeader()
  });
}

export function getAction(id: string) {
  return http<Action>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionUrl}/${encodeURIComponent(id)}`,
    mapToResultObject: true
  });
}

export function saveNewAction(action: NewAction) {
  return http<Action>({
    method: 'POST',
    maxRetries: 3,
    url: actionUrl,
    headers: getCsrfHeader(),
    data: action,
    mapToResultObject: true
  });
}

export function saveAction(action: NewAction, id: string) {
  return http<Action>({
    method: 'PUT',
    maxRetries: 3,
    url: `${actionUrl}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    data: action,
    mapToResultObject: true
  });
}

export function deleteAction(id: string) {
  return http<Action>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${actionUrl}/${encodeURIComponent(id)}`
  }).map(response => response.body);
}

export function runAction({
  volatileId,
  actionName,
  eventId,
  inputParameters,
  actionId,
  timeout,
  hostsLimit,
  policyId
}: {
  volatileId: VolatileId;
  eventId: string | undefined;
  actionName: string;
  actionId: string;
  inputParameters: ParameterValue[];
  timeout: string;
  hostsLimit?: string;
  policyId: string;
}) {
  return submitActionExecution({
    action: 'action.run',
    target: volatileId,
    args: {
      hostsLimit,
      inputParameters,
      async: 'true',
      eventId: eventId,
      actionName,
      actionId,
      timeout: timeout === '' ? null : timeout,
      policyId: policyId === '' ? null : policyId
    }
  });
}

export function runTurboAction({
  volatileId,
  event,
  actionName,
  actionId,
  timeout,
  createdDate,
  actionInstanceId,
  policyId
}: {
  volatileId: VolatileId;
  event: Event | undefined;
  actionName: string;
  actionId: string;
  timeout: string;
  policyId: string;
  createdDate: number;
  actionInstanceId: string;
}) {
  return turboSubmitActionExecution({
    action: 'turbonomic.executeAction',
    target: volatileId,
    args: {
      createdDate,
      actionInstanceId,
      async: 'true',
      event: JSON.stringify(event),
      eventId: event?.id,
      actionName,
      actionId,
      timeout: timeout === '' ? null : timeout,
      policyId: policyId === '' ? null : policyId
    }
  });
}

export function runResourceOptimizationAction({
  volatileId,
  actionName,
  createdDate,
  eventId,
  actionInstanceId
}: {
  volatileId: VolatileId;
  actionName: string;
  createdDate: number;
  actionInstanceId: string;
  eventId?: string;
}) {
  return turboSubmitActionExecution({
    action: 'turbonomic.executeAction',
    target: volatileId,
    args: {
      createdDate,
      actionInstanceId,
      actionName,
      eventId: eventId ?? null
    }
  });
}

export function getTurboActionResourceImpacts({
  volatileId,
  actionInstanceId,
  createdDate
}: {
  volatileId: VolatileId;
  createdDate: number;
  actionInstanceId: string;
}) {
  {
    return submitTurbonomicResourceImpact({
      action: 'turbonomic.resourceImpact',
      target: volatileId,
      args: {
        createdDate,
        actionInstanceId
      }
    });
  }
}

export function resolveDynamicParameters({ eventId, parameters, timestamp }: GetDynamicParameterValues) {
  return http<{
    parameters: ResolvedDynamicParamValue[];
  }>({
    method: 'PUT',
    maxRetries: 3,
    url: `${automationAPIBase}/parameters/dynamic`,
    headers: getCsrfHeader(),
    mapToResultObject: true,
    data: {
      eventId,
      parameters,
      timestamp
    }
  });
}

export function updateActionInstanceFeedback({
  id,
  feedback,
  to,
  windowSize,
  comment
}: {
  id: string;
  feedback: number;
  to: number;
  windowSize: number;
  comment: string;
}) {
  return http<ActionInstance>({
    method: 'PUT',
    maxRetries: 3,
    url: `${automationAPIBase}/actioninstances/${encodeURIComponent(id)}/feedback`,
    data: {
      feedback: feedback + '',
      comment: comment || ''
    },
    headers: getCsrfHeader(),
    queryParams: {
      to,
      windowSize
    }
  }).map(response => response.body);
}

export function getPolicies(actionId?: string) {
  let prams = {};
  if (actionId) prams = { queryParams: { actionId: encodeURIComponent(actionId) } };
  return http<Policy[]>({
    method: 'GET',
    maxRetries: 3,
    url: policiesUrl,
    mapToResultObject: true,
    ...prams
  });
}

export function getPolicyTags() {
  return http<{ tags: string[] }>({
    method: 'GET',
    maxRetries: 3,
    url: `${policiesUrl}/tags`,
    mapToResultObject: true
  });
}

export function getPolicy(id: string) {
  return http<Policy>({
    method: 'GET',
    maxRetries: 3,
    url: `${policiesUrl}/${id}`,
    mapToResultObject: true
  });
}

export function saveNewPolicy(policy: NewPolicy) {
  return http<Policy>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: policiesUrl,
    data: policy,
    mapToResultObject: true
  });
}

export function deletePolicy(id: string) {
  return http<Policy>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${policiesUrl}/${encodeURIComponent(id)}`
  });
}

export function savePolicy(policy: NewPolicy, id: string) {
  return http<Policy>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${policiesUrl}/${id}`,
    data: policy,
    mapToResultObject: true
  });
}

export function getPoliciesForTrigger(triggerId: string, triggerType: TriggerType) {
  return http<Policy[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: policiesUrl,
    queryParams: {
      triggerType,
      triggerId: encodeURIComponent(triggerId)
    },
    mapToResultObject: true
  });
}

export function saveBulkPolicies(policies: NewPolicy[]) {
  return http<Policy[]>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${policiesUrl}/bulk`,
    data: policies
  }).map(response => response.body);
}

export function getEventSpecifications() {
  return http<EventSpecificationInfo[]>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/events/settings/event-specifications/infos',
    mapToResultObject: true
  });
}

export function getApplicationSmartAlertConfigs() {
  return http<ApplicationSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.APPLICATION,
    mapToResultObject: true
  });
}

export function getWebsiteSmartAlertConfigs() {
  return http<WebsiteSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.WEBSITE,
    mapToResultObject: true
  });
}

export function getGlobalApplicationSmartAlertConfigs() {
  return http<GlobalApplicationsSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.APPLICATION_GLOBAL,
    mapToResultObject: true
  });
}

export function getMobileAppSmartAlertConfigs() {
  return http<MobileAppSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.MOBILEAPP,
    mapToResultObject: true
  });
}

export function getInfraSmartAlertConfigs() {
  return http<InfraSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.INFRA,
    mapToResultObject: true
  });
}

export function getLogSmartAlertConfigs() {
  return http<LogSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.LOGS,
    mapToResultObject: true
  });
}

export function getSloSmartAlertConfigs() {
  return http<ServiceLevelsAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.SLO,
    mapToResultObject: true
  });
}

export function getSyntheticSmartAlertConfigs() {
  return http<SyntheticAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.SYNTHETICS,
    mapToResultObject: true
  });
}

export function getEventSpecification(id: string) {
  return http<EventSpecificationInfo[]>({
    method: 'POST',
    url: `/api/events/settings/event-specifications/infos`,
    maxRetries: 3,
    mapToResultObject: true,
    data: [id],
    headers: getCsrfHeader()
  }).map(res => mapData(res, data => data?.[0]));
}

export function getApplicationSmartAlertConfig(id: string) {
  return http<ApplicationSmartAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.APPLICATION}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getGlobalApplicationSmartAlertConfig(id: string) {
  return http<ApplicationSmartAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.APPLICATION_GLOBAL}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getWebsiteSmartAlertConfig(id: string) {
  return http<WebsiteSmartAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.WEBSITE}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getMobileAppSmartAlertConfig(id: string) {
  return http<MobileAppSmartAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.MOBILEAPP}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getInfraSmartAlertConfig(id: string) {
  return http<InfraSmartAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.INFRA}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getLogSmartAlertConfig(id: string) {
  return http<LogSmartAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.LOGS}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getSyntheticSmartAlertConfig(id: string) {
  return http<SyntheticAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.SYNTHETICS}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getSloSmartAlertConfig(id: string) {
  return http<ServiceLevelsAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.SLO}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getDynamicParameterTagCatalog() {
  return http<TagCatalog>({
    method: 'GET',
    url: `${automationAPIBase}/parameters/dynamic/catalog`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function deleteActionInstance(id: string, createdDate: number) {
  return http<{ deletedDocumentsCount: string }>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${automationAPIBase}/actioninstances/${encodeURIComponent(id)}`,
    queryParams: {
      to: createdDate + minutes.toMillis(10),
      from: createdDate - minutes.toMillis(10)
    }
  }).map(response => response.body);
}

export function getActionNameExists(name: string, type: ActionType) {
  return http<ActionNameExists>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionUrl}/names/exists`,
    queryParams: {
      name,
      type
    },
    mapToResultObject: true
  });
}

export function getActionFilter() {
  return http<ActionFilter>({
    method: 'GET',
    url: `${actionUrl}/rbacActionFilters`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getGitops(data: any) {
  return http<any>({
    method: 'POST',
    maxRetries: 3,
    url: `${automationAPIBase}/gitops`,
    mapToResultObject: true,
    headers: getCsrfHeader(),
    data: data
  });
}
