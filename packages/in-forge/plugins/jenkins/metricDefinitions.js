/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis, number, percentagePlain } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [getDynamicMetricMatch('jobs', 'lastBuildStatus', 'Job')],
    labels: [t('in-forge:plugins.jenkins.statusOfTheLastBuild')],
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jobs', 'healthScore', 'Job'),
    label: t('in-forge:plugins.jenkins.healthStatusOfRecentBuilds'),
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: percentagePlain
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildNumber', 'Job'),
    label: t('in-forge:plugins.jenkins.lastBuildNumber'),
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildDuration', 'Job'),
    label: t('in-forge:plugins.jenkins.lastBuildDuration'),
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildEstimatedDuration', 'Job'),
    label: t('in-forge:plugins.jenkins.lastBuildEstimatedDuration'),
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildTimestamp', 'Job'),
    label: t('in-forge:plugins.jenkins.lastBuildTimestamp'),
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: millis
  }
];
