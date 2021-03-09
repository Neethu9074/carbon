/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t, Trans } from 'in-i18n';
import React from 'react';

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
    explanationLinkHref: `https://instana.com/docs/ecosystem/nginx/#nginx_api_not_accessible`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/nginx/#nginx_status_not_accessible`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/nginx/#nginx_api_not_found`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/nginx/#nginx_status_not_found`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/nginx/#nginx_config_location_not_discovered`
  }
};
