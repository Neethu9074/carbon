/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  kafka_ssl_not_configured: {
    issueDescription: {
      Component: function kafkaSslNotConfigured() {
        return (
          <span>
            <p>
              <Trans i18nKey="in-forge:plugins.kafka.kafkaMonitoringRequiresSslTruststoreLocation" />
            </p>
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.kafka.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/kafka/#kafka_ssl_not_configured`
  },
  kafka_ssl_client_not_configured: {
    issueDescription: {
      Component: function kafkaSslClientNotConfigured() {
        return (
          <span>
            <p>
              <Trans i18nKey="in-forge:plugins.kafka.kafkaMonitoringRequiresSslKeyStoreLocation" />
            </p>
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.kafka.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/kafka/#kafka_ssl_client_not_configured`
  }
};
