/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { formatCarbonDate, formatCarbonTime } from 'in-events/components/util/carbonDateTimeFormat';
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

export function formatForTable(nlg, apiResponse) {
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
          response_type: 'text',
          text: nlg
        },
        {
          response_type: 'user_defined',
          user_defined: {
            user_defined_type: 'table_chart',
            headers: [],
            rows: []
          }
        }
      ]
    }
  };
  const response = {
    response_type: 'user_defined',
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
    response.data.headers.push({ key: 'name', header: t('in-events:aichat.name') });
  } else if (useTag) {
    response.data.headers.push({ key: useTag, header: headerAlias[useTag] || useTag });
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
      response.data.headers.push({ key: key, header: headerAlias[key] || key });
    });
    if (countPresent) {
      response.data.headers.push({ key: 'count', header: t('in-events:aichat.count') });
    }
    response.data.headers.push({ key: 'timestamp', header: t('in-events:aichat.timestamp') });
    instanaApiResponse.forEach((entry, i) => {
      const row = {};
      row.name = entry.name || entry.tags?.[useTag];
      let timestamp;
      metricKeys.forEach((key, index) => {
        if (index === 0) {
          timestamp = entry.metrics[key]?.[0]?.[0];
        }
        row[key] = entry.metrics[key]?.[0]?.[1];
      });
      if (countPresent) {
        row.count = entry.count;
      }
      if (timestamp) {
        row.timestamp = `${formatCarbonDate(timestamp)} ${formatCarbonTime(timestamp)}`;
      } else {
        row.timestamp = undefined;
      }
      response.data.rows.push({ id: i, ...row });
    });
  } else {
    // No metric found, just push primary column data
    if (countPresent) {
      response.data.headers.push({ key: 'count', header: t('in-events:aichat.count') });
    }
    instanaApiResponse.forEach(entry => {
      const row = {};
      row[useTag] = entry.tags?.[useTag];
      if (countPresent) {
        row.count = entry.count;
      }
      response.data.rows.push({ id: entry.id, ...row });
    });
  }
  return {
    output: {
      generic: [
        {
          response_type: 'text',
          text: nlg
        },
        {
          response_type: 'user_defined',
          user_defined: {
            user_defined_type: 'table_chart',
            headers: response.data.headers,
            rows: response.data.rows
          }
        }
      ]
    }
  };
}

/**
 * Convert table headers and rows to chart format
 * @param tableData - { headers: headers, rows: paginatedRows }
 * @returns object - { data: response, options: options }
 */
export function formatForBarChart(tableData) {
  const options = {
    title: '',
    axes: {
      left: {
        mapsTo: 'value'
      },
      bottom: {
        mapsTo: 'group',
        scaleType: 'labels'
      }
    },
    height: '400px'
  };

  const emptyChartData = {
    data: [],
    options: options
  };

  const response = [];
  if (!tableData || tableData.rows.length === 0) {
    return emptyChartData;
  }

  // Extract headers and rows
  const headers = tableData.headers;
  const rows = tableData.rows;

  // Map sorted rows to bar chart format
  rows.forEach(row => {
    const group = row[headers[0].key];
    // currently only visualizing first column of metrics
    const value = row[headers[1].key];
    response.push({
      group: group,
      value: value
    });
  });

  return {
    data: response,
    options: options
  };
}
