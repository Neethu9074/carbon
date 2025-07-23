/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  redis_config_command_name_not_configured: {
    issueDescription: {
      Component: function redisConfigCommandNameNotConfigured() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.redis.configCommandNameNotConfigured" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.redis.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-redis#redis-config-command-name-not-enabled-and-configured`
  },

  redis_invalid_password: {
    issueDescription: {
      Component: function redisInvalidPassword({ host, port }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.redis.invalidPassword" values={{ host: host, port: port }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.redis.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/latest?topic=technologies-monitoring-redis`
  }
};
