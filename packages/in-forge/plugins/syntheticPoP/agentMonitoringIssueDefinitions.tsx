/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  redis_tls_not_enabled: {
    issueDescription: {
      Component: function redisTLSNotEnabled() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.syntheticPoP.redisTLSNotEnabled" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.syntheticPoP.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/current?topic=technologies-monitoring-synthetic-pop-open-beta#redis-tls-not-enabled`
  },
  tls_not_configured: {
    issueDescription: {
      Component: function tlsNotConfigured() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.syntheticPoP.tlsNotConfigured" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.syntheticPoP.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/current?topic=technologies-monitoring-synthetic-pop-open-beta#tls-not-configured`
  }
};
