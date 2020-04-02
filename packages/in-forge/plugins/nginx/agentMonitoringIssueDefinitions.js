import React from 'react';

export default {
  nginx_api_not_accessible: {
    issueDescription: {
      Component: function nginxApiNotAccessible({ url }) {
        return (
          <span>
            The API URL <code>{url}</code> could not be accessed.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/nginx/#enabling-metrics-collection`
  },
  nginx_status_not_accessible: {
    issueDescription: {
      Component: function nginxStatusNotAccessible({ url }) {
        return (
          <span>
            The status URL <code>{url}</code> could not be accessed.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/nginx/#enabling-metrics-collection`
  },

  nginx_api_not_found: {
    issueDescription: {
      Component: function nginxApiNotFound({ config }) {
        return (
          <span>
            The API URL could not be found in the configuration <code>{config}</code>.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/nginx/#enabling-metrics-collection`
  },
  nginx_status_not_found: {
    issueDescription: {
      Component: function nginxStatusNotFound({ config }) {
        return (
          <span>
            The status URL could not be found in the configuration <code>{config}</code>.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/nginx/#enabling-metrics-collection`
  },
  nginx_config_not_accessible: {
    issueDescription: {
      Component: function nginxConfigNotAccessible() {
        return <span>The configuration file could not be found.</span>;
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/nginx/#enabling-metrics-collection`
  }
};
