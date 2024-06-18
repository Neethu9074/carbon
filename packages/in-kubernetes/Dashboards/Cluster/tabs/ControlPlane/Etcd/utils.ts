/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// import { themes} from '@instana/design-tokens';

import { t } from 'in-i18n';

// const {
//   red800: sentOrCas,
//   deepPurple800: received,
//   green800: cad,
//   orange800: create,
//   lime800: deleteColour
// } = themes.default.lib.colors;

export const defaultChartMetricConfig = {
  source: 'INFRASTRUCTURE_METRICS',
  type: 'kubernetesPod',
  aggregation: 'MEAN',
  tagFilterExpression: {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: [
      {
        type: 'TAG_FILTER',
        name: 'kubernetes.cluster.name',
        operator: 'EQUALS',
        entity: 'NOT_APPLICABLE',
        value: 'DemoPoP1Cluster'
      },
      {
        type: 'TAG_FILTER',
        name: 'kubernetes.namespace.name',
        operator: 'EQUALS',
        entity: 'NOT_APPLICABLE',
        value: 'openshift-monitoring'
      },
      {
        type: 'TAG_FILTER',
        name: 'kubernetes.pod.name',
        operator: 'EQUALS',
        entity: 'NOT_APPLICABLE',
        value: 'alertmanager-main-0'
      }
    ]
  },
  timeConfig: {
    to: null,
    windowSize: 3600000,
    focusedMoment: null,
    autoRefresh: false
  },
  timeShift: {
    offset: 0
  },
  granularity: 60000
};

export const isContainerMetric = {
  /* use this configuration on containers of this pod (which can be of type docker, containerd or crio)
    type filtering must be disabled and cross series aggregation uses SUM */
  type: undefined,
  crossSeriesAggregation: 'SUM'
};

export const kpiCharts = [
  {
    metrics: [
      {
        metric: 'requests_received',
        label: t('in-kubernetes:dashboards.received'),
        // color: received,
        ...defaultChartMetricConfig,
        ...isContainerMetric
      },
      {
        metric: 'requests_sent',
        label: t('in-kubernetes:dashboards.sent'),
        // color: sentOrCas,
        ...defaultChartMetricConfig
      }
    ],
    title: t('in-kubernetes:dashboards.request'),
    // colors: [received, sentOrCas],
    formatter: 'bytes.detailed',
    paramTab: 'memoryTab',
    paramMetric: 'memoryMetric',
    path: '#'
  },
  {
    metrics: [
      {
        metric: 'memory.usage',
        label: t('in-kubernetes:dashboards.received'),
        // color: received,
        ...defaultChartMetricConfig,
        ...isContainerMetric
      },
      {
        metric: 'memoryRequests',
        label: t('in-kubernetes:dashboards.sent'),
        // color: sentOrCas,
        ...defaultChartMetricConfig
      }
    ],
    title: t('in-kubernetes:dashboards.traffic'),
    // colors: [received, sentOrCas, cad],
    formatter: 'bytes.detailed',
    paramTab: 'memoryTab',
    paramMetric: 'memoryMetric',
    path: '#'
  },
  {
    metrics: [
      {
        metric: 'memory.usage',
        label: t('in-kubernetes:dashboards.cad'),
        // color: cad,
        ...defaultChartMetricConfig,
        ...isContainerMetric
      },
      {
        metric: 'memoryRequests',
        label: t('in-kubernetes:dashboards.cas'),
        // color: sentOrCas,
        ...defaultChartMetricConfig
      },
      {
        metric: 'memoryRequests',
        label: t('in-kubernetes:dashboards.create'),
        // color: create,
        ...defaultChartMetricConfig
      },
      {
        metric: 'memoryRequests',
        label: t('in-kubernetes:dashboards.delete'),
        // color: deleteColour,
        ...defaultChartMetricConfig
      }
    ],
    title: t('in-kubernetes:dashboards.operations'),
    // colors: [cad, sentOrCas, create, deleteColour],
    formatter: 'bytes.detailed',
    paramTab: 'memoryTab',
    paramMetric: 'memoryMetric',
    path: '#'
  }
];
