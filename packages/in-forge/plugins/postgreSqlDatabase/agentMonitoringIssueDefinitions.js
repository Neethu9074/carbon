import React from 'react';

export default {
  postgresql_stats_not_enabled: {
    issueDescription: {
      Component: function postgresqlStatsNotEnabled() {
        return (
          <span>
            Statistics collection is not enabled by server configuration. Please make sure <code>track_counts</code>,{' '}
            <code>track_activities</code>, <code>track_io_timing</code> are set to <strong>on</strong> in{' '}
            <code>postgresql.conf</code>.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/postgresql/#postgresql_stats_not_enabled`
  },

  postgresql_authentication_failed: {
    issueDescription: {
      Component: function postgresqlAuthenticationFailed({ user, errorcode }) {
        return (
          <span>
            Agent could not connect to PostgreSQL. Password authentication failed for user <code>{user}</code>. Error
            code: <code>{errorcode}</code>
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/postgresql/#postgresql_authentication_failed`
  },

  postgresql_connection_failed: {
    issueDescription: {
      Component: function postgresqlConnectionFailed({ user, host, port, errorcode }) {
        return (
          <span>
            Agent could not connect to PostgreSQL on {host}:{port} with user: <code>{user}</code>. Error code:{' '}
            <code>{errorcode}</code>
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/postgresql/#postgresql_connection_failed`
  }
};
