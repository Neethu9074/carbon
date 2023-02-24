/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from "react";

import { t } from "@instana/i18n-react";

const globalMonitoringIssues = {
  data_processing_issue_metric_cardinality_limit_exceeded: {
    issueDescription: {
      Component: function() {
        return (
          <div>{t('in-sdk:agentMonitoringMetricCardinalityExceeded')}</div>
        );
      }
    },
    explanationLinkLabel: t('in-sdk:agentMonitoringExplanationLinkLabel'),
    explanationLinkHref: 'https://www.ibm.com/docs/en/instana-observability/current?topic=dashboards-example-infrastructure#limitations'
  }
};

export default globalMonitoringIssues;
