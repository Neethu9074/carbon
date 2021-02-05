/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import {
  newTimeMetric,
  newNumberMetric,
  newSizeMetric,
  withRawDataField,
  newNumberWithDecimalsMetric
} from 'in-analyze/metricDefinitionHelpers';
import { percentage, number, fourDecimalPlaces } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { affectedUsers } from 'in-websites/formatters';

export const clsFormatter = {
  compact: fourDecimalPlaces,
  detailed: fourDecimalPlaces
};

export const timestampMetricName = 'timestamp';
export const groupNameMetricName = 'name';
export const groupCountMetricName = 'count';

export function buildOrderByCriteria(metric, aggregation) {
  return `${metric}_${aggregation}_Agg`;
}

export const defaultMetrics = {
  pageLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  pageChange: [{ metric: 'uniqueUsersOrSessions', aggregation: 'DISTINCT_COUNT' }],
  resourceLoad: [{ metric: 'beaconDuration', aggregation: 'MEAN' }],
  httpRequest: [
    { metric: 'beaconDuration', aggregation: 'MEAN' },
    { metric: 'beaconErrorRate', aggregation: 'MEAN' }
  ],
  error: [{ metric: 'uniqueUsersOrSessions', aggregation: 'DISTINCT_COUNT' }],
  custom: [{ metric: 'uniqueUsersOrSessions', aggregation: 'DISTINCT_COUNT' }]
};

const resourceTimingMetrics = [
  withRawDataField(
    newTimeMetric({
      metric: 'redirectTime',
      label: t('in-websites:analyze.analyzeView.resourceTimingMetricsLabelRedirectTime'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceTiming')
    }),
    {
      tag: 'beacon.timing.redirect'
    }
  ),
  withRawDataField(
    newTimeMetric({
      metric: 'appCacheTime',
      label: t('in-websites:analyze.analyzeView.resourceTimingMetricsLabelAppCacheTime'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceTiming')
    }),
    {
      tag: 'beacon.timing.appCache'
    }
  ),
  withRawDataField(
    newTimeMetric({
      metric: 'dnsTime',
      label: t('in-websites:analyze.analyzeView.resourceTimingMetricsLabelDNSTime'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceTiming')
    }),
    {
      tag: 'beacon.timing.dns'
    }
  ),
  withRawDataField(
    newTimeMetric({
      metric: 'tcpTime',
      label: t('in-websites:analyze.analyzeView.resourceTimingMetricsLabelTCPTime'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceTiming')
    }),
    {
      tag: 'beacon.timing.tcp'
    }
  ),
  withRawDataField(
    newTimeMetric({
      metric: 'sslTime',
      label: t('in-websites:analyze.analyzeView.resourceTimingMetricsLabelSSLTime'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceTiming')
    }),
    {
      tag: 'beacon.timing.ssl'
    }
  ),
  withRawDataField(
    newTimeMetric({
      metric: 'requestTime',
      label: t('in-websites:analyze.analyzeView.resourceTimingMetricsLabelRequestTime'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceTiming')
    }),
    {
      tag: 'beacon.timing.request'
    }
  ),
  withRawDataField(
    newTimeMetric({
      metric: 'responseTime',
      label: t('in-websites:analyze.analyzeView.resourceTimingMetricsLabelResponseTime'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceTiming')
    }),
    {
      tag: 'beacon.timing.response'
    }
  ),
  withRawDataField(
    newTimeMetric({
      metric: 'ttfb',
      label: t('in-websites:analyze.analyzeView.resourceTimingMetricsLabelTimeToFirstByte'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceTiming')
    }),
    {
      tag: 'beacon.timing.timeToFirstByte',
      rawDataField: 'backendTime'
    }
  )
];

const resourceSizeMetrics = [
  withRawDataField(
    newSizeMetric({
      metric: 'encodedBodySize',
      label: t('in-websites:analyze.analyzeView.resourceSizeMetricsLabelEncodedBodySize'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceSizing')
    }),
    {
      tag: 'beacon.http.encodedBodySize'
    }
  ),
  withRawDataField(
    newSizeMetric({
      metric: 'decodedBodySize',
      label: t('in-websites:analyze.analyzeView.resourceSizeMetricsLabelDecodedBodySize'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceSizing')
    }),
    {
      tag: 'beacon.http.decodedBodySize'
    }
  ),
  withRawDataField(
    newSizeMetric({
      metric: 'transferSize',
      label: t('in-websites:analyze.analyzeView.resourceSizeMetricsLabelTransferSize'),
      category: t('in-websites:analyze.analyzeView.resourceTimingMetricsCategoryResourceSizing')
    }),
    {
      tag: 'beacon.http.transferSize'
    }
  )
];

const uniqueUsers = {
  category: t('in-websites:analyze.analyzeView.uniqueUsersCategoryUserSessionTracking'),
  metric: 'uniqueUsers',
  label: t('in-websites:analyze.analyzeView.uniqueUsersLabelUniqueUsers'),
  formatter: affectedUsers,
  supportedAggregations: ['DISTINCT_COUNT'],
  preferredRenderer: Renderer.stackedBar,
  min: 0
};

const uniqueSessions = {
  category: t('in-websites:analyze.analyzeView.uniqueSessionsCategoryUserSessionTracking'),
  metric: 'uniqueSessions',
  label: t('in-websites:analyze.analyzeView.uniqueSessionsLabelUniqueSessions'),
  formatter: affectedUsers,
  supportedAggregations: ['DISTINCT_COUNT'],
  preferredRenderer: Renderer.stackedBar,
  min: 0
};

const uniqueUsersOrSessions = {
  category: t('in-websites:analyze.analyzeView.uniqueUsersOrSessionsCategoryUserSessionTracking'),
  metric: 'uniqueUsersOrSessions',
  label: t('in-websites:analyze.analyzeView.uniqueUsersOrSessionsLabelUniqueUsersSessions'),
  formatter: affectedUsers,
  supportedAggregations: ['DISTINCT_COUNT'],
  preferredRenderer: Renderer.stackedBar,
  min: 0
};

const errorRate = {
  metric: 'beaconErrorRate',
  label: t('in-websites:analyze.analyzeView.errorRateLabelErrorRate'),
  formatter: percentage,
  supportedAggregations: ['MEAN'],
  preferredRenderer: Renderer.stackedBar,
  min: 0,
  rawDataField: 'errorCount',
  rawDataLabel: t('in-websites:analyze.analyzeView.errorRateLabelErrorCount'),
  rawDataFormatter: number.compact,
  tag: 'beacon.error.count'
};

export const availableMetrics = {
  pageLoad: [
    newNumberMetric({
      metric: 'pageLoads',
      label: t('in-websites:analyze.analyzeView.availableMetricsLabelPageLoads')
    }),
    withRawDataField(
      newTimeMetric({
        metric: 'beaconDuration',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelOnLoadTime')
      }),
      {
        rawDataField: 'duration',
        tag: 'beacon.duration'
      }
    ),
    uniqueUsers,
    uniqueSessions,
    uniqueUsersOrSessions,

    withRawDataField(
      newTimeMetric({
        metric: 'unloadTime',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelUnloadTime'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryNavigationTiming')
      }),
      {
        tag: 'beacon.timing.unload'
      }
    ),
    // reassign the category
    ...resourceTimingMetrics.map(metric => ({
      ...metric,
      category: t('in-websites:analyze.analyzeView.availableMetricsCategoryNavigationTiming')
    })),
    withRawDataField(
      newTimeMetric({
        metric: 'processingTime',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelProcessingTime'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryNavigationTiming')
      }),
      {
        tag: 'beacon.timing.processing'
      }
    ),
    withRawDataField(
      newTimeMetric({
        metric: 'onLoadEventDuration',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelOnLoadEventTime'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryNavigationTiming')
      }),
      {
        rawDataField: 'onLoadTime',
        tag: 'beacon.timing.onLoad'
      }
    ),
    withRawDataField(
      newTimeMetric({
        metric: 'domTime',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelDOMTime'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryNavigationTiming')
      }),
      {
        tag: 'beacon.timing.dom'
      }
    ),
    withRawDataField(
      newTimeMetric({
        metric: 'childrenTime',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelChildrenTime'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryNavigationTiming')
      }),
      {
        tag: 'beacon.timing.children'
      }
    ),
    withRawDataField(
      newTimeMetric({
        metric: 'backendTime',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelBackendTime'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryNavigationTiming')
      }),
      {
        tag: 'beacon.timing.backend'
      }
    ),
    withRawDataField(
      newTimeMetric({
        metric: 'frontendTime',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelFrontendTime'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryNavigationTiming')
      }),
      {
        tag: 'beacon.timing.frontend'
      }
    ),

    withRawDataField(
      newTimeMetric({
        metric: 'firstPaintTime',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelFirstPaint'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryPaintTiming')
      }),
      {
        tag: 'beacon.timing.firstPaint'
      }
    ),
    withRawDataField(
      newTimeMetric({
        metric: 'firstContentfulPaintTime',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelFirstContentfulPaint'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryPaintTiming')
      }),
      {
        tag: 'beacon.timing.firstContentfulPaint'
      }
    ),
    withRawDataField(
      newTimeMetric({
        metric: 'largestContentfulPaintTime',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelLargestContentfulPaint'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryPaintTiming')
      }),
      {
        tag: 'beacon.timing.largestContentfulPaint'
      }
    ),
    withRawDataField(
      newTimeMetric({
        metric: 'firstInputDelay',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelFirstInputDelay')
      }),
      {
        tag: 'beacon.timing.firstInputDelay',
        rawDataField: 'firstInputDelayTime'
      }
    ),
    withRawDataField(
      newNumberWithDecimalsMetric({
        metric: 'cumulativeLayoutShift',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelCumulativeLayoutShift'),
        formatter: clsFormatter
      }),
      {
        tag: 'beacon.cumulativeLayoutShift'
      }
    )
  ],
  pageChange: [
    newNumberMetric({
      metric: 'pageTransitions',
      label: t('in-websites:analyze.analyzeView.availableMetricsLabelPageTransitions')
    }),
    uniqueUsers,
    uniqueSessions,
    uniqueUsersOrSessions
  ],
  resourceLoad: [
    newNumberMetric({
      metric: 'beaconCount',
      label: t('in-websites:analyze.analyzeView.availableMetricsLabelResourceLoads')
    }),
    withRawDataField(
      newTimeMetric({
        metric: 'beaconDuration',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelRetrievalTime')
      }),
      {
        rawDataField: 'duration',
        tag: 'beacon.duration'
      }
    ),
    uniqueUsers,
    uniqueSessions,
    uniqueUsersOrSessions,
    ...resourceTimingMetrics,
    ...resourceSizeMetrics
  ],
  httpRequest: [
    newNumberMetric({ metric: 'beaconCount', label: t('in-websites:analyze.analyzeView.availableMetricsLabelCalls') }),
    newNumberMetric({
      metric: 'beaconErrorCount',
      label: t('in-websites:analyze.analyzeView.availableMetricsLabelErroneousCalls')
    }),
    withRawDataField(
      newTimeMetric({
        metric: 'beaconDuration',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelRetrievalTime')
      }),
      {
        rawDataField: 'duration',
        tag: 'beacon.duration'
      }
    ),
    errorRate,
    uniqueUsers,
    uniqueSessions,
    uniqueUsersOrSessions,
    ...resourceTimingMetrics,
    ...resourceSizeMetrics,

    withRawDataField(
      newNumberMetric({
        metric: 'http1xx',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTP1XXCount'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryHTTP')
      }),
      {
        rawDataField: 'httpCallStatus',
        rawDataLabel: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPStatus'),
        tag: 'beacon.http.status'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'http2xx',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTP2XXCount'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryHTTP')
      }),
      {
        rawDataField: 'httpCallStatus',
        rawDataLabel: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPStatus'),
        tag: 'beacon.http.status'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'http3xx',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTP3XXCount'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryHTTP')
      }),
      {
        rawDataField: 'httpCallStatus',
        rawDataLabel: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPStatus'),
        tag: 'beacon.http.status'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'http4xx',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTP4XXCount'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryHTTP')
      }),
      {
        rawDataField: 'httpCallStatus',
        rawDataLabel: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPStatus'),
        tag: 'beacon.http.status'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'http5xx',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTP5XXCount'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryHTTP')
      }),
      {
        rawDataField: 'httpCallStatus',
        rawDataLabel: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPStatus'),
        tag: 'beacon.http.status'
      }
    ),

    withRawDataField(
      newNumberMetric({
        metric: 'httpGet',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPGETCount'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryHTTP')
      }),
      {
        rawDataField: 'httpCallMethod',
        rawDataLabel: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPMethod'),
        tag: 'beacon.http.method'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'httpPost',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPPOSTCount'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryHTTP')
      }),
      {
        rawDataField: 'httpCallMethod',
        rawDataLabel: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPMethod'),
        tag: 'beacon.http.method'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'httpPut',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPPUTCount'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryHTTP')
      }),
      {
        rawDataField: 'httpCallMethod',
        rawDataLabel: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPMethod'),
        tag: 'beacon.http.method'
      }
    ),
    withRawDataField(
      newNumberMetric({
        metric: 'httpDelete',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPDELETECount'),
        category: t('in-websites:analyze.analyzeView.availableMetricsCategoryHTTP')
      }),
      {
        rawDataField: 'httpCallMethod',
        rawDataLabel: t('in-websites:analyze.analyzeView.availableMetricsLabelHTTPMethod'),
        tag: 'beacon.http.method'
      }
    )
  ],
  error: [
    newNumberMetric({
      metric: 'beaconCount',
      label: t('in-websites:analyze.analyzeView.availableMetricsLabelOccurrences')
    }),
    {
      ...uniqueUsers,
      // relabel the metric
      label: t('in-websites:analyze.analyzeView.availableMetricsLabelAffectedUsers')
    },
    {
      ...uniqueSessions,
      // relabel the metric
      label: t('in-websites:analyze.analyzeView.availableMetricsLabelAffectedSessions')
    },
    {
      ...uniqueUsersOrSessions,
      // relabel the metric
      label: t('in-websites:analyze.analyzeView.availableMetricsLabelAffectedUsersSessions')
    }
  ],
  custom: [
    newNumberMetric({
      metric: 'beaconCount',
      label: t('in-websites:analyze.analyzeView.availableMetricsLabelOccurrences')
    }),
    withRawDataField(
      newTimeMetric({
        metric: 'beaconDuration',
        label: t('in-websites:analyze.analyzeView.availableMetricsLabelDuration')
      }),
      {
        rawDataField: 'duration',
        tag: 'beacon.duration'
      }
    ),
    uniqueUsers,
    uniqueSessions,
    uniqueUsersOrSessions
  ]
};
