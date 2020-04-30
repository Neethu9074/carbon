import React from 'react';

// These configured Events might be related to the Agent itself, or generic Sensor issues that cannot be related to
// a specific process on the host.
export default {
  clr_instana_pcp_not_available: {
    issueDescription: {
      Component: function clrInstanaPcpNotAvailable() {
        return (
          <span>
            The Instana Agent cannot connect to the InstanaPCP process, resulting in limited visibility of .NET
            processes
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/dot-net/#tracing`
  }
};
