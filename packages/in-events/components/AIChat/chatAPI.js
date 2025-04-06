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
  // Human readable column names
  const headerAlias = {
    'label.kubernetesNode': t('in-events:aichat.host'),
    'latency.mean': t('in-events:aichat.meanLatency'),
    'calls.sum': t('in-events:aichat.numCalls')
  };
  const emptyResult = {
    output: {
      generic: [
        {
          response_type: 'table',
          headers: [],
          rows: []
        }
      ]
    }
  };
  const response = {
    response_type: 'table',
    data: {
      headers: [],
      rows: []
    }
  };
  const instanaApiResponse = apiResponse.items;
  if (!instanaApiResponse || instanaApiResponse.length === 0) {
    return emptyResult;
  }

  const first = instanaApiResponse[0];
  const potentialTags = (Object.keys(first.tags || {}) || []).filter(x => /^label\..*|.*\.name$/.test(x));
  let useTag = potentialTags.length > 0 ? potentialTags[0] : null;
  if (first.name) {
    response.data.headers.push(t('in-events:aichat.name'));
  } else if (useTag) {
    response.data.headers.push(headerAlias[useTag] || useTag);
  } else {
    // No primary column found
    return emptyResult;
  }

  const countPresent = first.count !== undefined;
  const metricKeys = Object.keys(first.metrics || {});
  const firstMetric = metricKeys.length > 0 ? first.metrics[metricKeys[0]]?.[0] || [] : [];
  if (firstMetric.length === 2) {
    // [timestamp, metric] format
    metricKeys.forEach(key => {
      response.data.headers.push(headerAlias[key] || key);
    });
    if (countPresent) {
      response.data.headers.push(t('in-events:aichat.count'));
    }
    response.data.headers.push(t('in-events:aichat.timestamp'));
    instanaApiResponse.forEach(entry => {
      const cells = [];
      cells.push(entry.name || entry.tags?.[useTag]);
      let timestamp;
      metricKeys.forEach((key, index) => {
        if (index === 0) {
          timestamp = entry.metrics[key]?.[0]?.[0];
        }
        cells.push(entry.metrics[key]?.[0]?.[1]);
      });
      if (countPresent) {
        cells.push(entry.count);
      }
      if (timestamp) {
        cells.push(new Date(timestamp).toISOString());
      } else {
        cells.push(undefined);
      }
      response.data.rows.push({ cells });
    });
  } else {
    // No metric found, just push primary column data
    if (countPresent) {
      response.data.headers.push(t('in-events:aichat.count'));
    }
    instanaApiResponse.forEach(entry => {
      let cells = [];
      cells.push(entry.tags?.[useTag]);
      if (countPresent) {
        cells.push(entry.count);
      }
      response.data.rows.push({ cells });
    });
  }
  return {
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
}
