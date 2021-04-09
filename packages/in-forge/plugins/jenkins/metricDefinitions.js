/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis, number, percentagePlain } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [getDynamicMetricMatch('jobs', 'lastBuildStatus', t('in-forge:plugins.jenkins.job'))],
    labels: [t('in-forge:plugins.jenkins.statusOfTheLastBuild')],
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jobs', 'healthScore', t('in-forge:plugins.jenkins.job')),
    label: t('in-forge:plugins.jenkins.healthStatusOfRecentBuilds'),
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: percentagePlain
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildNumber', t('in-forge:plugins.jenkins.job')),
    label: t('in-forge:plugins.jenkins.lastBuildNumber'),
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildDuration', t('in-forge:plugins.jenkins.job')),
    label: t('in-forge:plugins.jenkins.lastBuildDuration'),
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildEstimatedDuration', t('in-forge:plugins.jenkins.job')),
    label: t('in-forge:plugins.jenkins.lastBuildEstimatedDuration'),
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('jobs', 'lastBuildTimestamp', t('in-forge:plugins.jenkins.job')),
    label: t('in-forge:plugins.jenkins.lastBuildTimestamp'),
    category: [t('in-forge:plugins.jenkins.jobs')],
    min: 0,
    formatter: millis
  }
];
