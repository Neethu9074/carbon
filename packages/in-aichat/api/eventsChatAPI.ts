/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

// Define interfaces for the API payloads
interface ChatPayload {
  api_endpoint: string;
  to?: number;
  windowSize?: number;
  from?: number;
  filterEventUpdate?: boolean;
  eventTypeFilters?: string[];
  excludeTriggeredBefore?: boolean;
  [key: string]: any;
}

interface EventsPayload {
  [key: string]: any;
}

export interface AgentQueryParams {
  query: string;
  thread_id?: string;
}

// The api query to the chat
// Simply pass in the query string
export function sendAPIQuery(query: any) {
  // Feature flag removed, always allow API calls
  const obj = http({
    method: 'POST',
    maxRetries: 3,
    url: `api/chat/query`,
    headers: getCsrfHeader(),
    data: {
      query: query
    }
  });
  return obj.map(response => response.body);
}

export function fetchAPIData(chatPayload: ChatPayload) {
  const endpoint = chatPayload.api_endpoint;
  const { api_endpoint, ...payloadWithoutEndpoint } = chatPayload;

  if (endpoint === '/api/events') {
    const obj = http({
      method: 'GET',
      maxRetries: 3,
      url: endpoint,
      headers: getCsrfHeader(),
      queryParams: {
        to: chatPayload.to,
        windowSize: chatPayload.windowSize,
        from: chatPayload.from,
        filterEventUpdate: chatPayload.filterEventUpdate,
        eventTypeFilters: chatPayload.eventTypeFilters,
        excludeTriggeredBefore: chatPayload.excludeTriggeredBefore
      }
    });
    return obj.map(response => response.body);
  } else {
    const obj = http({
      method: 'POST',
      maxRetries: 3,
      url: endpoint,
      headers: getCsrfHeader(),
      data: payloadWithoutEndpoint
    });
    return obj.map(response => response.body);
  }
}

export function fetchEventsData(eventsPayload: EventsPayload, apiPayload: string) {
  const endpoint = '/api/chat/events';
  const obj = http({
    method: 'POST',
    maxRetries: 3,
    url: endpoint,
    headers: getCsrfHeader(),
    data: { eventData: eventsPayload, query: apiPayload }
  });
  return obj.map(response => response.body);
}

/**
 * Send a query to the agent API (currently same as traditional query, will update later when backend updates)
 * @param query - The user's query to send to the agent API
 * @returns An observable that will emit the agent's response
 */
export function sendAgentQuery(params: AgentQueryParams) {
  const obj = http({
    method: 'POST',
    maxRetries: 3,
    url: 'api/chat/agent',
    headers: getCsrfHeader(),
    data: params
  });
  return obj.map(response => response.body);
}
