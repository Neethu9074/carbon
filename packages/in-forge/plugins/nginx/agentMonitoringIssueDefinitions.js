import React from 'react';

export default {
  nginx_api_not_accessible: {
    issueDescription: {
      Component: function nginxApiNotAccessible({ url }) {
        return (
          <span>
            The API URL <code>{url}</code> of this Nginx process is not accessible from the host agent.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/nginx/#nginx_api_not_accessible`
  },
  nginx_status_not_accessible: {
    issueDescription: {
      Component: function nginxStatusNotAccessible({ url }) {
        return (
          <span>
            The status URL <code>{url}</code> of this Nginx process is not accessible from the host agent.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/nginx/#nginx_status_not_accessible`
  },

  nginx_api_not_found: {
    issueDescription: {
      Component: function nginxApiNotFound({ config }) {
        return (
          <span>
            The configuration of this Nginx Plus process in file <code>{config}</code>, does not seem to define a{' '}
            <code>location</code> that exposes the <code>api</code> data provided by the{' '}
            <code>ngx_http_api_module</code> module.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/nginx/#nginx_api_not_found`
  },
  nginx_status_not_found: {
    issueDescription: {
      Component: function nginxStatusNotFound({ config }) {
        return (
          <span>
            The configuration of this Nginx process in file <code>{config}</code>, does not seem to define a{' '}
            <code>location</code> that exposes the <code>stub_status</code> data provided by the{' '}
            <code>ngx_http_stub_status_module</code> module.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/nginx/#nginx_status_not_found`
  },
  nginx_config_location_not_discovered: {
    issueDescription: {
      Component: function nginxConfigLocationNotDiscovered() {
        return (
          <span>The host agent cannot determine the location of the configuration file of this Nginx process.</span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/nginx/#nginx_config_location_not_discovered`
  }
};
