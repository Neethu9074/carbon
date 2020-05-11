import React from 'react';

// Process plugin contains various error codes for other plugins because they appear when the sensor
// can't connect. In those situations we won't have the higher-level entity, so can only 'attach' the
// AgentMonitoringEvent to the process itself.
export default {
  agent_jvm_blacklisted: {
    issueDescription: {
      Component: function agentJVMBlacklisted() {
        return (
          <span>
            The host agent cannot attach correctly to this Java Virtual Machine. Therefore, this process will not be
            traced. Look into the host agent logs for more information as to why the JVM has been blacklisted. The host
            agent will try to connect again to this virtual machine every ten minutes. However, until it succeeds,
            neither traces nor metrics will be collected for this JVM.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/jvm/#agent_jvm_blacklisted`
  },
  java_8u40_not_monitored: {
    issueDescription: {
      Component: function java8u40NotMonitored({ version }) {
        return (
          <span>
            The Java 8 builds up to 1.8.0_40 have several known issues relating to the implementation of lambdas. Due to
            these issues this JVM with version {version} will not be monitored.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/jvm#java_8u40_not_monitored`
  },
  nodejs_collector_not_installed: {
    issueDescription: {
      Component: function nodejsCollectorNotInstalled() {
        return (
          <span>
            The <code>@instana/collector</code> package is not installed in this Node.js application, or the{' '}
            <code>@instana/collector</code> package cannot announce itself to the host agent, for example due to
            networking issues.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/node-js/#nodejs_collector_not_installed`
  },
  python_auto_instrumentation_failed: {
    issueDescription: {
      Component: function pythonAutoInstrumentationFailed() {
        return <span>The host agent tried and failed to automatically instrument this Python process.</span>;
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/python/#python_auto_instrumentation_failed`
  },
  python_sensor_not_installed: {
    issueDescription: {
      Component: function pythonSensorNotInstalled() {
        return (
          <span>
            The <code>instana</code> package is not installed in this Python application, or the <code>instana</code>{' '}
            package cannot announce itself to the host agent, for example due to networking issues.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/python/#python_sensor_not_installed`
  },
  ruby_sensor_not_installed: {
    issueDescription: {
      Component: function rubySensorNotInstalled() {
        return (
          <span>
            The <code>instana</code> gem is not installed in this Ruby application, or the <code>instana</code> gem
            cannot announce itself to the host agent, for example due to networking issues.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/ruby/#ruby_sensor_not_installed`
  }
};
