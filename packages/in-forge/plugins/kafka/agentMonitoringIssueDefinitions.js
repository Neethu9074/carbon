/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

export default {
  kafka_ssl_not_configured: {
    issueDescription: {
      Component: function kafkaSslNotConfigured() {
        return (
          <span>
            <p>
              Kafka monitoring requires <code>sslTruststoreLocation</code> and <code>sslTruststorePassword</code> to be
              configured in Instana agent <code>configuration.yaml</code> for Kafka instances secured with TLS.
            </p>
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/kafka/#kafka_ssl_not_configured`
  },
  kafka_ssl_client_not_configured: {
    issueDescription: {
      Component: function kafkaSslClientNotConfigured() {
        return (
          <span>
            <p>
              Kafka monitoring requires <code>sslKeyStoreLocation</code> and <code>sslKeyStorePassword</code> to be
              configured in Instana agent <code>configuration.yaml</code> for Kafka instances requiring SSL client
              authentication.
            </p>
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/kafka/#kafka_ssl_client_not_configured`
  }
};
