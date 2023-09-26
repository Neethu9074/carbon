/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

// Process plugin contains various error codes for other plugins because they appear when the sensor
// can't connect. In those situations we won't have the higher-level entity, so can only 'attach' the
// AgentMonitoringEvent to the process itself.
export default {
  jvm_attach_generic: {
    issueDescription: {
      Component: function jvmAttachGeneric() {
        return <span>{t('in-forge:plugins.process.jvmAttachGenericIssueDescription')}</span>;
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-java-virtual-machine#generic-jvm-attachment-issue`
  },
  jvm_attach_container_command: {
    issueDescription: {
      Component: function jvmAttachContainerCommand({ targetContainerId, containerCommand, exitValue }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.process.jvmAttachContainerCommandIssueDescription"
              components={{
                code: <code />
              }}
              values={{
                containerCommand: containerCommand,
                exitValue: exitValue,
                targetContainerId: targetContainerId
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-java-virtual-machine#container-attachment-failed`
  },
  jvm_attach_tools: {
    issueDescription: {
      Component: function jvmAttachTools() {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.process.jvmAttachToolsIssueDescription"
              components={{
                code: <code />
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-java-virtual-machine#attach-tools-missing`
  },
  jvm_attach_socket: {
    issueDescription: {
      Component: function jvmAttachSocket() {
        return <span>{t('in-forge:plugins.process.jvmAttachSocketIssueDescription')}</span>;
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-java-virtual-machine#restart-needed`
  },
  jvm_attach_directory: {
    issueDescription: {
      Component: function jvmAttachDirectory() {
        return <span>{t('in-forge:plugins.process.jvmAttachDirectoryIssueDescription')}</span>;
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-java-virtual-machine#attach-directory-failure`
  },
  insufficient_disk_space_for_storing_temp_files: {
    issueDescription: {
      Component: function insufficientDiskMemory() {
        return <span>{t('in-forge:plugins.process.insufficientDiskMemoryIssueDescription')}</span>;
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref:
      'https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-java-virtual-machine#insufficient_disk_space_for_storing_temp_files'
  },
  jvm_attach_network: {
    issueDescription: {
      Component: function jvmAttachNetwork({ agentHostAddresses }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.process.jvmAttachNetworkIssueDescription"
              components={{
                code: <code />
              }}
              values={{
                agentHostAddresses: agentHostAddresses
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-java-virtual-machine#network-visibility-issues`
  },
  ibm_jvm_class_sharing_enabled: {
    issueDescription: {
      Component: function ibmJvmClassSharingEnabled() {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.process.ibmJvmClassSharingEnabledIssueDescription"
              components={{
                code: <code />
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-java-virtual-machine#ibm-j9-class-sharing-enabled`
  },
  nodejs_collector_not_installed: {
    issueDescription: {
      Component: function nodejsCollectorNotInstalled() {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.process.nodejsCollectorNotInstalledIssueDescription"
              components={{
                code: <code />
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-nodejs#nodejs-collector-not-installed`
  },
  python_autotrace_failed: {
    issueDescription: {
      Component: function pythonAutoTraceFailed() {
        return <span>{t('in-forge:plugins.process.pythonAutoTraceFailedIssueDescription')}</span>;
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/python-auto-trace-fail`
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
                <Trans
                  i18nKey="in-forge:plugins.process.autoTraceConfigurationdisabled"
                  components={{
                    strong: <strong />
                  }}
                />
              </fragment>
            );
          } else if (autoTraceActive !== 'true' && autoTraceSupported === 'true') {
            detailedInfo = (
              <fragment>
                <br />
                <Trans
                  i18nKey="in-forge:plugins.process.autoTracePrerequisites"
                  components={{
                    strong: <strong />
                  }}
                />
              </fragment>
            );
          }
        }

        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.process.pythonSensorNotInstalledIssueDescription"
              components={{
                code: <code />
              }}
            />
            {detailedInfo}
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/python-sensor-not-installed`
  },
  ruby_sensor_not_installed: {
    issueDescription: {
      Component: function rubySensorNotInstalled() {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.process.rubySensorNotInstalledIssueDescription"
              components={{
                code: <code />
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-ruby#ruby-sensor-not-installed`
  },
  prometheus_remote_write_high_delay: {
    issueDescription: {
      Component: function prometheusRemoteWriteHighDelay({ metricDelayMs }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.process.prometheusRemoteWriteHighDelayIssueDescription"
              components={{
                code: <code />
              }}
              values={{ metricDelayMs: metricDelayMs }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=apis-prometheus#remote-write-high-metric-delay`
  },
  cpp_collector_not_installed: {
    issueDescription: {
      Component: function cppCollectorNotInstalled() {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.process.cppCollectorNotInstalledIssueDescription"
              components={{
                code: <code />
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    // TODO verify! There is no section like #cpp_collector_not_installed
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-nginx#troubleshooting`
  }
};
