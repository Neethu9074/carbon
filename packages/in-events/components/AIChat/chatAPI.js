/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { automationActionAiGenerationUnitEnabled } from 'in-services/featureFlags';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';
import { t } from 'in-i18n';

// The api query to the chat
// Simply pass in the query string
export function sendAPIQuery(query) {
  if (!automationActionAiGenerationUnitEnabled) {
    // Should not be accessable, prevent call to AI endpoint
    // if user has not agreed to terms
    return null;
  }
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
  const obj = http({
    method: 'POST',
    maxRetries: 3,
    url: endpoint,
    headers: getCsrfHeader(),
    data: chatPayload
  });
  return obj.map(response => response.body);
}

export function formatForTable(apiResponse) {
  const instanaApiResponse = apiResponse.items;
  const finalResponseRowList = [];
  const response = {
    response_type: 'table',
    data: {
      headers: [t('in-events:aichat.name')],
      rows: []
    }
  };
  const headerAlias = {
    'latency.mean': t('in-events:aichat.meanLatency'),
    'calls.sum': t('in-events:aichat.numCalls')
  };
  if (instanaApiResponse.length === 0) {
    // Return empty table
  } else if (instanaApiResponse[0].tags?.['label.kubernetesNode']) {
    response.data.headers = [t('in-events:aichat.host')];
    instanaApiResponse.forEach(entry => {
      response.data.rows.push({ cells: [entry.tags?.['label.kubernetesNode']] });
    });
  } else {
    const metricOptions = Object.keys(instanaApiResponse[0].metrics || {});
    const metric = metricOptions.length > 0 ? metricOptions[0] : undefined;
    // Fall back to metric property name table header if alias does not exist
    if (metric) {
      response.data.headers.push(t('in-events:aichat.timestamp'));
      response.data.headers.push(headerAlias[metric] || metric);
    }
    instanaApiResponse.forEach(entry => {
      const cells = [];
      let name =
        entry.name ||
        entry.tags?.['label.ibmMqQueue'] ||
        entry.tags?.['ibmmq.queue.name'] ||
        entry.tags?.['label.jvmRuntimePlatform'];
      cells.push(name);
      if (metric && 'metrics' in entry) {
        const timestamp = entry.metrics[metric][0][0];
        cells.push(new Date(timestamp).toISOString());
        cells.push(String(entry.metrics[metric][0][1]));
      }
      finalResponseRowList.push({ cells });
    });
    response.data.rows = finalResponseRowList;
  }
  const responseObject = {
    output: {
      generic: [
        {
          response_type: response.response_type,
          headers: response.data.headers,
          rows: response.data.rows
        }
      ]
    }
  };
  return responseObject;
}
