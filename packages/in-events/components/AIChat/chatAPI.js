/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { formatDateTime } from '@instana/format-date';

import { formatCarbonDate, formatCarbonTime } from 'in-events/components/util/carbonDateTimeFormat';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';
import { t } from 'in-i18n';

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
          response_type: 'user_defined',
          user_defined: {
            user_defined_type: 'nlg_response',
            text: nlg
          }
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

      if (useTag) {
        row[useTag] = entry.tags?.[useTag];
      } else {
        row.name = entry.name;
      }

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
          response_type: 'user_defined',
          user_defined: {
            user_defined_type: 'nlg_response',
            text: nlg
          }
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

export function formatForEventsTable(nlg, apiResponse) {
  // Create response structure with NLG text
  const createResponse = (headers, rows) => ({
    output: {
      generic: [
        {
          response_type: 'user_defined',
          user_defined: { user_defined_type: 'nlg_response', text: nlg }
        },
        {
          response_type: 'user_defined',
          user_defined: { user_defined_type: 'events_table', headers, rows }
        }
      ]
    }
  });

  // Empty result for invalid data
  const emptyResult = createResponse([], []);

  // Standard headers
  const baseHeaders = [
    { key: 'name', header: t('in-events:aichat.name') },
    { key: 'on', header: t('in-events:aichat.on') },
    { key: 'started', header: t('in-events:aichat.started') },
    { key: 'end', header: t('in-events:aichat.end') },
    { key: 'state', header: t('in-events:aichat.state') }
  ];

  // Headers with group column
  const groupedHeaders = [
    ...baseHeaders.slice(0, 2),
    { key: 'group', header: t('in-events:aichat.group') },
    ...baseHeaders.slice(2)
  ];

  // Extract events data
  const events = apiResponse?.data?.events;
  if (!events || !Array.isArray(events) || events.length === 0) {
    return emptyResult;
  }

  // Case 1: Array of event objects directly
  if (events[0].entityName || events[0].entityType || events[0].start) {
    const rows = events.map((event, index) => ({
      id: `row-${index}`,
      name: event.problem || '',
      on: event.entityLabel || '',
      started: formatDateTime(event.start),
      end: formatDateTime(event.end),
      state: event.state || '',
      eventId: event.eventId
    }));

    return createResponse(baseHeaders, rows);
  }

  // Case 2: Array with a single object containing grouped events
  else {
    const rows = [];
    const firstItem = events[0];

    // Check if the first item is an object with keys mapping to arrays
    if (typeof firstItem === 'object' && firstItem !== null) {
      Object.entries(firstItem).forEach(([groupKey, groupEvents]) => {
        if (!Array.isArray(groupEvents)) return;

        groupEvents.forEach((event, index) => {
          rows.push({
            id: `row-${groupKey}-${index}`,
            name: event.problem || '',
            on: event.entityLabel || '',
            group: groupKey,
            started: formatDateTime(event.start),
            end: formatDateTime(event.end),
            state: event.state || '',
            eventId: event.eventId
          });
        });
      });

      if (rows.length === 0) return emptyResult;
      return createResponse(groupedHeaders, rows);
    }
  }

  return emptyResult;
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
  if (!tableData || tableData.rows?.length === 0) {
    return emptyChartData;
  }

  // Extract headers and rows
  const headers = tableData?.headers;
  const rows = tableData?.rows;

  // Map sorted rows to bar chart format
  rows.forEach(row => {
    const group = row[headers?.[0]?.key];
    // currently only visualizing first column of metrics
    const value = row[headers?.[1]?.key];
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
