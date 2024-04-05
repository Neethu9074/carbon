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
    explanationLinkHref: `https://ibm.biz/kafka-ssl-not-config`
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
    explanationLinkHref: `https://ibm.biz/kafka-ssl-client-auth-not-config`
  },
  kafka_invalid_jmx_credentials: {
    issueDescription: {
      Component: function kafkaInvalidJmxCredentials() {
        return (
          <span>
            <p>
              <Trans i18nKey="in-forge:plugins.kafka.kafkaMonitoringRequiresJmxAuthentication" />
            </p>
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.kafka.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/jmx-auth-not-config`
  }
};
