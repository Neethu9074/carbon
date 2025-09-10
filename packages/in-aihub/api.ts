/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import type { GatewayPayload } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/types/gatewayFormTypes';
import type { Gateway } from 'in-aihub/GatewaysCatalogComponents/useGatewaysData';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

const aihubAPIBase = '/api/llm';
const egressUrl = `${aihubAPIBase}/egress/handler` as const;

const capabilityUrl = `${aihubAPIBase}/capabilities`;
type TaskType = string[];

export function getEgressGateways() {
  return http<Gateway[]>({
    method: 'GET',
    maxRetries: 3,
    url: egressUrl,
    mapToResultObject: true
  });
}

export function createGateway(payload: GatewayPayload) {
  return http<Gateway>({
    method: 'POST',
    maxRetries: 0,
    url: egressUrl,
    headers: getCsrfHeader(),
    data: payload,
    mapToResultObject: true
  });
}

export function getGateway(id: string) {
  return http<Gateway>({
    method: 'GET',
    maxRetries: 0,
    url: `${egressUrl}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

export function deleteGateway(id: string) {
  return http<Gateway>({
    method: 'DELETE',
    maxRetries: 0,
    url: `${egressUrl}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

export function editGateway(payload: GatewayPayload, id: string) {
  return http<Gateway>({
    method: 'PUT',
    maxRetries: 0,
    url: `${egressUrl}/${encodeURIComponent(id)}`,
    data: payload,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

export function getCapabilities() {
  return http<TaskType>({
    method: 'GET',
    maxRetries: 0,
    url: capabilityUrl,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

//get enabled gateway

export function getEnabledGateway(capability: string) {
  return http<Gateway>({
    method: 'GET',
    maxRetries: 0,
    url: `${egressUrl}?enabled=true&capability=${capability}`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

//enable gateway. this will disable existing one too

export function enableGateway(id: string) {
  return http<Gateway>({
    method: 'PUT',
    maxRetries: 0,
    url: `${egressUrl}/${encodeURIComponent(id)}/enable`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}
