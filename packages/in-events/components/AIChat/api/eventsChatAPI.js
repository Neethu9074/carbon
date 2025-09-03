/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

// The api query to the chat
// Simply pass in the query string
export function sendAPIQuery(query) {
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

export function fetchAPIData(chatPayload) {
  const endpoint = chatPayload.api_endpoint;
  delete chatPayload.api_endpoint;
  let obj = http({
    method: 'POST',
    maxRetries: 3,
    url: endpoint,
    headers: getCsrfHeader(),
    data: chatPayload
  });
  if (endpoint === '/api/events') {
    obj = http({
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
  }

  return obj.map(response => response.body);
}

export function fetchEventsData(eventsPayload, apiPayload) {
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
 * @param {string} query - The user's query to send to the agent API
 * @returns {Object} - An observable that will emit the agent's response
 */
export function sendAgentQuery(query) {
  const obj = http({
    method: 'POST',
    maxRetries: 3,
    url: 'api/chat/query',
    headers: getCsrfHeader(),
    data: {
      query: query
    }
  });
  return obj.map(response => response.body);
}
