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
            <Trans i18nKey="in-forge:plugins.syntheticPoP.redisTLSNotEnabledIssueDescription" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.syntheticPoP.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/insta-synthpoptlsnotenabled`
  },
  tls_not_configured: {
    issueDescription: {
      Component: function tlsNotConfigured() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.syntheticPoP.tlsNotConfiguredIssueDescription" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.syntheticPoP.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/insta-synthpoptlsnotconfig`
  },
  call_pop_health_api_failed: {
    issueDescription: {
      Component: function popHealthAPIFailed() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.syntheticPoP.popHealthAPIFailedIssueDescription" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.syntheticPoP.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/pop-health-failed`
  }
};
