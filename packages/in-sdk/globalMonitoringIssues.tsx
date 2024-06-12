/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import { maxMetricsLimitForBeeinstanaEnabled } from 'in-services/featureFlags';

const globalMonitoringIssues = {
  data_processing_issue_metric_cardinality_limit_exceeded: {
    issueDescription: {
      Component: function () {
        return <div>{t('in-sdk:agentMonitoringMetricCardinalityExceeded')}</div>;
      }
    },
    explanationLinkLabel: t('in-sdk:agentMonitoringExplanationLinkLabel'),
    explanationLinkHref:
      'https://www.ibm.com/docs/en/instana-observability/current?topic=dashboards-example-infrastructure#limitations'
  },
  max_metrics_reached: {
    issueDescription: {
      Component: function ({ numberOfMetrics }: { numberOfMetrics: string }) {
        if (maxMetricsLimitForBeeinstanaEnabled) {
          return <div>{t('in-infrastructure:dashboard.metricExplosionBeeInstana', { numberOfMetrics })}</div>;
        }
        return <div>{t('in-infrastructure:dashboard.metricExplosion', { numberOfMetrics })}</div>;
      }
    },
    explanationLinkLabel: t('in-sdk:agentMonitoringExplanationLinkLabel'),
    explanationLinkHref:
      'https://www.ibm.com/docs/en/instana-observability/current?topic=instana-monitoring-infrastructure#limitations'
  }
};

export default globalMonitoringIssues;
