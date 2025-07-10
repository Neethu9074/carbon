/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  nginx_api_not_accessible: {
    issueDescription: {
      Component: function nginxApiNotAccessible({ url }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.nginx.theApiUrlCodeUrlCodeOfThisNginxProcessIsNotAccessibleFromTheHostAgent"
              values={{ url }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.nginx.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-nginx#nginx-api-is-not-accessible`
  },
  nginx_status_not_accessible: {
    issueDescription: {
      Component: function nginxStatusNotAccessible({ url }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.nginx.theStatusUrlCodeUrlCodeOfThisNginxProcessIsNotAccessibleFromTheHostAgent"
              values={{ url }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.nginx.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-nginx#nginx-status-endpoint-is-not-accessible`
  },

  nginx_api_not_found: {
    issueDescription: {
      Component: function nginxApiNotFound({ config }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.nginx.theConfigurationOfThisNginxProcessDoesNotExposesTheApi"
              values={{ config }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.nginx.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-nginx#nginx-api-is-not-found`
  },
  nginx_status_not_found: {
    issueDescription: {
      Component: function nginxStatusNotFound({ config }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.nginx.theConfigurationOfThisNginxProcessDoesNotExposesTheStubStatus"
              values={{ config }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.nginx.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-nginx#nginx-status-is-not-found`
  },
  nginx_config_location_not_discovered: {
    issueDescription: {
      Component: function nginxConfigLocationNotDiscovered() {
        return (
          <span>
            {t('in-forge:plugins.nginx.theHostAgentCannotDetermineTheLocationOfTheConfigurationFileOfThisNginxProcess')}
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.nginx.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-nginx#nginx-config-location-not-discovered`
  }
};
