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
  },
  nodejs_collector_not_installed: {
    issueDescription: {
      Component: function nodejsCollectorNotInstalled() {
        return (
          <span>The NodeJS Collector is not installed or the Collector failed to register itself with the agent</span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/node-js/installation/`
  },
  python_auto_instrumentation_failed: {
    issueDescription: {
      Component: function pythonAutoInstrumentationFailed() {
        return <span>Instana AutoTrace™ failed to instrument the Python process</span>;
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/python/`
  },
  python_sensor_not_installed: {
    issueDescription: {
      Component: function pythonSensorNotInstalled() {
        return <span>The Python Sensor is not installed or the Sensor failed to register itself with the agent</span>;
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/python/`
  }
};
