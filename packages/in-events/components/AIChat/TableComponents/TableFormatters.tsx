/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { BarChartOptions, ScaleTypes } from '@carbon/charts';
import { MessageResponseTypes } from '@carbon/ai-chat';

import { formatDateTime } from '@instana/format-date';

import {
  ThumbsFeedbackObject,
  TypeTextObject,
  TableChartObject,
  EventsTableObject
} from 'in-events/components/AIChat/ResponseObjects';
import { EVENT_AI_CHAT_API_RESULT_POSITIVE, EVENT_AI_CHAT_API_RESULT_NEGATIVE } from 'in-services/tracking/eventNames';
import { Entry, TableRow, TableHeader } from 'in-events/components/AIChat/TableComponents/useTableState';
import { formatCarbonDate, formatCarbonTime } from 'in-events/components/util/carbonDateTimeFormat';
import { t } from 'in-i18n';

export function formatForTable(apiResponse: any, userQuery: string, queryResponse: any) {
  const nlg = queryResponse?.api?.NLG;
  // Human readable column names
  const headerAlias: { [key: string]: string } = {
    'label.kubernetesNode': t('in-events:aichat.host'),
    'latency.mean': t('in-events:aichat.meanLatency'),
    'calls.sum': t('in-events:aichat.numCalls')
  };
  const emptyResult = {
    output: {
      generic: [
        TypeTextObject(nlg),
        TableChartObject([], []),
        ThumbsFeedbackObject(EVENT_AI_CHAT_API_RESULT_POSITIVE, EVENT_AI_CHAT_API_RESULT_NEGATIVE, {
          nlgResponse: nlg,
          userQuery: userQuery,
          apiEndpoint: queryResponse?.api?.api_endpoint || '-',
          technology: queryResponse?.technology || '-',
          type: queryResponse?.type || '-'
        })
      ]
    }
  };

  const response: {
    response_type: MessageResponseTypes.USER_DEFINED;
    data: {
      headers: TableHeader[];
      rows: TableRow[];
    };
  } = {
    response_type: MessageResponseTypes.USER_DEFINED,
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

    instanaApiResponse.forEach((entry: Entry, i: number) => {
      const row: Omit<TableRow, 'id'> = {};

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
      row.id = `chat-table-row-${i}`;
      response.data.rows.push({ ...row } as TableRow);
    });
  } else {
    // No metric found, just push primary column data
    if (countPresent) {
      response.data.headers.push({ key: 'count', header: t('in-events:aichat.count') });
    }
    instanaApiResponse.forEach((entry: Entry) => {
      const row: Omit<TableRow, 'id'> = {};
      if (useTag) {
        row[useTag] = entry.tags?.[useTag];
      }
      if (countPresent) {
        row.count = entry.count;
      }
      row.id = entry.id;
      response.data.rows.push({ ...row } as TableRow);
    });
  }
  return {
    output: {
      generic: [
        TypeTextObject(nlg),
        TableChartObject(response.data.headers, response.data.rows),
        ThumbsFeedbackObject(EVENT_AI_CHAT_API_RESULT_POSITIVE, EVENT_AI_CHAT_API_RESULT_NEGATIVE, {
          nlgResponse: nlg,
          userQuery: userQuery,
          apiEndpoint: queryResponse?.api?.api_endpoint || '-',
          technology: queryResponse?.technology || '-',
          type: queryResponse?.type || '-'
        })
      ]
    }
  };
}

export function formatForEventsTable(apiResponse: any, userQuery: string, queryResponse: any) {
  const nlg = queryResponse?.api?.NLG || '';
  // Create response structure with NLG text
  const createResponse = (headers: TableHeader[], rows: TableRow[]) => ({
    output: {
      generic: [
        TypeTextObject(nlg),
        EventsTableObject(headers, rows),
        ThumbsFeedbackObject(EVENT_AI_CHAT_API_RESULT_POSITIVE, EVENT_AI_CHAT_API_RESULT_NEGATIVE, {
          nlgResponse: nlg,
          userQuery: userQuery,
          apiEndpoint: queryResponse?.api?.api_endpoint || '-',
          technology: queryResponse?.technology || '-',
          type: queryResponse?.type || '-'
        })
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
    const rows: TableRow[] = events.map((event, index) => ({
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
    const rows: TableRow[] = [];
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
export function formatForBarChart(tableData: { headers: TableHeader[]; rows: TableRow[] }) {
  const options: BarChartOptions = {
    title: '',
    axes: {
      left: {
        mapsTo: 'value'
      },
      bottom: {
        mapsTo: 'group',
        scaleType: ScaleTypes.LABELS
      }
    },
    height: '400px'
  };

  const emptyChartData = {
    data: [],
    options: options
  };

  const response: any[] = [];
  if (!tableData || tableData.rows?.length === 0) {
    return emptyChartData;
  }

  // Extract headers and rows
  const headers: TableHeader[] = tableData?.headers;
  const rows: TableRow[] = tableData?.rows;

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
