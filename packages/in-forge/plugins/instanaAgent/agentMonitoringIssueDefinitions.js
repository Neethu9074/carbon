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
  },
  agent_process_lookup_prerequisites_failed: {
    issueDescription: {
      Component: function agentProcessLookupPrerequisitesFailed({ missingUtils }) {
        const missing = Array.isArray(missingUtils) ? missingUtils.join(', ') : missingUtils;
        return (
          <span>
            The lookup of which process is sending traces to this agent using trace endpoints like OpenTelemetry, Jaeger, Zipkin or Web Trace SDK cannot be performed because the following utilities are missing:{' '}
            <strong>
              <code>{missing}</code>
            </strong>
            . Please refer to your Linux distribution docs on how to install these utilities.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/setup_and_manage/host_agent`
  }
};
