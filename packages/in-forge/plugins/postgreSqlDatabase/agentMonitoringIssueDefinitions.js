/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  postgresql_stats_not_enabled: {
    issueDescription: {
      Component: function postgresqlStatsNotEnabled() {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.postgreSqlDatabase.statsNotEnabledIssueDescription"
              components={{
                code: <code />,
                strong: <strong />
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.postgreSqlDatabase.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/postgresql/#postgresql_stats_not_enabled`
  },

  postgresql_authentication_failed: {
    issueDescription: {
      Component: function postgresqlAuthenticationFailed({ user, errorcode }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.postgreSqlDatabase.authFailedsDashboardNotification"
              components={{
                code: <code />
              }}
              values={{ user: user, errorcode: errorcode }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.postgreSqlDatabase.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/postgresql/#postgresql_authentication_failed`
  },

  postgresql_connection_failed: {
    issueDescription: {
      Component: function postgresqlConnectionFailed({ user, host, port, errorcode }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.postgreSqlDatabase.connectionFailedIssueDescription"
              components={{
                code: <code />
              }}
              values={{ host: host, port: port, user: user, errorcode: errorcode }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.postgreSqlDatabase.troubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/postgresql/#postgresql_connection_failed`
  }
};
