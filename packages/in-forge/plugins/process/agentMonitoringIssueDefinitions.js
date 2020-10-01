import React from 'react';

// Process plugin contains various error codes for other plugins because they appear when the sensor
// can't connect. In those situations we won't have the higher-level entity, so can only 'attach' the
// AgentMonitoringEvent to the process itself.
export default {
  jvm_attach_generic: {
    issueDescription: {
      Component: function jvmAttachGeneric() {
        return (
          <span>
            The host agent cannot attach correctly to this Java Virtual Machine. Therefore, this process will not be
            traced. Refer to the host agent logs for more information as to why the attachment failed. The host agent
            will try to connect again to this virtual machine every ten minutes. However, until it succeeds, neither
            traces nor metrics will be collected for this JVM.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/jvm/#jvm-attach-generic`
  },
  jvm_attach_container_command: {
    issueDescription: {
      Component: function jvmAttachContainerCommand({ targetContainerId, containerCommand, exitValue }) {
        return (
          <span>
            The host agent cannot attach correctly to this Java Virtual Machine. The container command{' '}
            <code>
              ${containerCommand}
              ...
            </code>
            exited with code <code>${exitValue}</code> when trying to attach the JVM in container{' '}
            <code>${targetContainerId}</code>. Therefore, this process will not be traced. Refer to the host agent logs
            for more information as to why the attachment failed. The host agent will try to connect again to this
            virtual machine every ten minutes. However, until it succeeds, neither traces nor metrics will be collected
            for this JVM.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/jvm/#jvm-attach-container-command`
  },
  jvm_attach_tools: {
    issueDescription: {
      Component: function jvmAttachTools() {
        return (
          <span>
            The host agent cannot attach correctly to this Java Virtual Machine. An appropriate{' '}
            <code>AttachProvider</code> or <code>VirtualMachine</code> could not be found from the JDK running the
            attach process. The JDKs tools.jar or jdk.attach module is missing. Therefore, this process will not be
            traced. Refer to the host agent logs for more information as to why the attachment failed. The host agent
            will try to connect again to this virtual machine every ten minutes. However, until it succeeds, neither
            traces nor metrics will be collected for this JVM.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/jvm/#jvm-attach-tools`
  },
  jvm_attach_socket: {
    issueDescription: {
      Component: function jvmAttachSocket() {
        return (
          <span>
            The host agent cannot attach correctly to this Java Virtual Machine. The JVM is unable to connect to a
            communication socket used during dynamic attach. Please try restarting the JVM to restore its attach
            capability. Therefore, this process will not be traced. Refer to the host agent logs for more information as
            to why the attachment failed. The host agent will try to connect again to this virtual machine every ten
            minutes. However, until it succeeds, neither traces nor metrics will be collected for this JVM.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/jvm/#jvm-attach-socket`
  },
  jvm_attach_network: {
    issueDescription: {
      Component: function jvmAttachNetwork({ agentHostAddresses }) {
        return (
          <span>
            The host agent cannot attach correctly to this Java Virtual Machine. The target JVM is unable to connect
            back to the agent process on port 42699 on the following ip addresses: <code>${agentHostAddresses}</code>.
            Please check for any firewall solutions blocking the connection. Therefore, this process will not be traced.
            Refer to the host agent logs for more information as to why the attachment failed. The host agent will try
            to connect again to this virtual machine every ten minutes. However, until it succeeds, neither traces nor
            metrics will be collected for this JVM.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/jvm/#jvm-attach-network`
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
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/node-js/#nodejs_collector_not_installed`
  },
  python_autotrace_failed: {
    issueDescription: {
      Component: function pythonAutoTraceFailed() {
        return <span>The host agent tried and failed to automatically instrument this Python process.</span>;
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/python/troubleshooting#python_autotrace_failed`
  },
  python_sensor_not_installed: {
    issueDescription: {
      Component: function pythonSensorNotInstalled({
        autoTraceConfigurationEnabled,
        autoTraceActive,
        autoTraceSupported
      }) {
        let detailedInfo = '';
        if (
          autoTraceConfigurationEnabled !== undefined &&
          autoTraceActive !== undefined &&
          autoTraceSupported !== undefined
        ) {
          if (autoTraceConfigurationEnabled !== 'true') {
            detailedInfo = (
              <fragment>
                <br />
                <strong>Python AutoTrace is disabled</strong> per configuration. In such cases, request and metric
                visibility can be achieved using one of the manual install methods.
              </fragment>
            );
          } else if (autoTraceActive !== 'true' && autoTraceSupported === 'true') {
            detailedInfo = (
              <fragment>
                <br />
                <strong>AutoTrace prerequisites not fulfilled</strong> on the host.
              </fragment>
            );
          }
        }

        return (
          <span>
            The <code>instana</code> package is not installed in this Python application, or the <code>instana</code>{' '}
            package cannot announce itself to the host agent, for example due to networking issues. {detailedInfo}
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/python/troubleshooting#python_sensor_not_installed`
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
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://www.instana.com/docs/ecosystem/ruby/#ruby_sensor_not_installed`
  }
};
