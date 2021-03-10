/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

import { Trans, t } from 'in-i18n';

export default {
  apmproxy_missing_config: {
    issueDescription: {
      Component: function apmproxyMissingConfig({ missingConfig }) {
        const missing = Array.isArray(missingConfig) ? missingConfig.join(', ') : missingConfig;
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.apmProxy.monitoringIssue.apmProxyMissingConfig" values={{ missing }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.apmProxy.troubleShootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/ibm-apmproxy/#apmproxy_missing_config`
  },
  apmproxy_connection_error: {
    issueDescription: {
      Component: function apmproxyConnectionError() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.apmProxy.monitoringIssue.apmProxyConnectionError" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.apmProxy.troubleShootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/ibm-apmproxy/#apmproxy_connection_error`
  },
  apmproxy_exception_error: {
    issueDescription: {
      Component: function apmproxyExceptionError(e) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.apmProxy.monitoringIssue.apmProxyExceptionError" values={{ e }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.apmProxy.troubleShootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/ibm-apmproxy/#apmproxy_exception_error`
  }
};
