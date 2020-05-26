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
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/dot-net/#clr_instana_pcp_not_running`
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
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/dot-net/#clr_instana_pcp_not_connected`
  }
};
