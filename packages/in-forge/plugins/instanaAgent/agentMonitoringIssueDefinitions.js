import React from 'react';

// These configured Events might be related to the Agent itself, or generic Sensor issues that cannot be related to
// a specific process on the host.
export default {
  clr_instana_pcp_not_running: {
    issueDescription: {
      Component: function clrInstanaPcpNotRunning() {
        return (
          <span>
            The InstanaPCP process seems not to be running on this host, which prevents the host agent from tracing .NET
            applications.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net/#clr_instana_pcp_not_running`
  },
  clr_instana_pcp_not_connected: {
    issueDescription: {
      Component: function clrInstanaPcpNotConnected() {
        return (
          <span>
            The host agent cannot connect to the running InstanaPCP process, which prevents the host agent from tracing
            .NET applications.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net/#clr_instana_pcp_not_connected`
  },
  python_autotrace_prerequisites_failed: {
    issueDescription: {
      Component: function pythonAutoTracePrerequisitesFailed() {
        return (
          <span>
            The host agent is missing one or more prerequisites for enabling the Instana AutoTrace functionality. This
            results in Python processes not being instrumented automatically.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/python/troubleshooting/#python_autotrace_prerequisites_failed`
  }
};
