import React from 'react';

export default {
  agent_jvm_blacklisted: {
    issueDescription: {
      Component: function agentJVMBlacklisted() {
        return (
          <span>
            The Instana agent is not capable of attaching correctly to this Java Virtual Machine. This process will not
            be traced. Look into the agent logs for more information as to why the JVM has been blacklisted. The agent
            will try to connect again to this virtual machine every ten minutes, but until it succeeds, no traces will
            be collected.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/jvm`
  }
};
