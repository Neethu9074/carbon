/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  metric_limit_exceeded: {
    issueDescription: {
      Component: function metricLimitExceeded() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.dropwizardApplicationContainer.metricLimitExceeded" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.dropwizardApplicationContainer.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-dropwizard#metrics`
  }
};
