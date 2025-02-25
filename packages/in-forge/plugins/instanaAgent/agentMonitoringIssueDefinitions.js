/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Trans, t } from 'in-i18n';

// These configured Events might be related to the Agent itself, or generic Sensor issues that cannot be related to
// a specific process on the host.
export default {
  clr_instana_pcp_not_running: {
    issueDescription: {
      Component: function clrInstanaPcpNotRunning() {
        return (
          <span>
            {t(
              'in-forge:plugins.instanaAgent.theInstanaPcpProcessSeemsNotToBeRunningOnThisHostWhichPreventsTheHostAgentFromTracingNetApplications'
            )}
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/insta-netfpcpnotrun`
  },
  clr_instana_pcp_not_connected: {
    issueDescription: {
      Component: function clrInstanaPcpNotConnected() {
        return (
          <span>
            {t(
              'in-forge:plugins.instanaAgent.theHostAgentCannotConnectToTheRunningInstanaPcpProcessWhichPreventsTheHostAgentFromTracingNetApplications'
            )}
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/insta-netfpcpnotcon`
  },
  python_autotrace_prerequisites_failed: {
    issueDescription: {
      Component: function pythonAutoTracePrerequisitesFailed() {
        return (
          <span>
            {t(
              'in-forge:plugins.instanaAgent.theHostAgentIsMissingOneOrMorePrerequisitesForEnablingTheInstanaAutoTraceFunctionality'
            )}
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/python-autotrace-prereq-fail`
  },
  ibmdatapower_var_not_defined: {
    issueDescription: {
      Component: function ibmDataPowerVarNotDefined({ instanceName, missingVariableKeys }) {
        const missing = Array.isArray(missingVariableKeys) ? missingVariableKeys.join(', ') : missingVariableKeys;
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.instanaAgent.ibmDataPowerMissingConfig"
              values={{ instanceName, missing }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-datapower#variable-not-defined`
  },
  ibmdatapower_var_invalid_value: {
    issueDescription: {
      Component: function ibmDataPowerVarInvalidValue({ instanceName, invalidKey, invalidValue }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.instanaAgent.ibmDataPowerVariablesInvalid"
              values={{ instanceName, invalidKey, invalidValue }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-datapower#variable-has-an-invalid-value`
  },
  ibmdatapower_connection_error: {
    issueDescription: {
      Component: function ibmDataPowerConnectionError({ url, rtnCode, response }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.instanaAgent.ibmDataPowerConnectionError"
              values={{ url, rtnCode, response }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-datapower#connection-error`
  },
  ibmdatapower_exception_error: {
    issueDescription: {
      Component: function ibmDataPowerExceptionError({ errorMessage }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.ibmDataPowerExceptionError" values={{ errorMessage }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-datapower#other-exception`
  },
  agent_process_lookup_prerequisites_failed: {
    issueDescription: {
      Component: function agentProcessLookupPrerequisitesFailed({ missingUtils }) {
        const missing = Array.isArray(missingUtils) ? missingUtils.join(', ') : missingUtils;
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.instanaAgent.theLookupOfWhichProcessIsSendingTracesToThisAgentUsingTraceEndpoints"
              values={{ missing: missing }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/insta-hostagent`
  },
  apmproxy_missing_config: {
    issueDescription: {
      Component: function apmproxyMissingConfig({ missingConfig }) {
        const missing = Array.isArray(missingConfig) ? missingConfig.join(', ') : missingConfig;
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.apmProxyMissingConfig" values={{ missing }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.apmProxy.troubleShootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-integrating-apm-v8#missing-configuration`
  },
  apmproxy_connection_error: {
    issueDescription: {
      Component: function apmproxyConnectionError() {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.apmProxyConnectionError" />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.apmProxy.troubleShootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-integrating-apm-v8#connection-error`
  },
  apmproxy_exception_error: {
    issueDescription: {
      Component: function apmproxyExceptionError({ e }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.apmProxyExceptionError" values={{ e }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.apmProxy.troubleShootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-integrating-apm-v8#other-exception`
  },
  agent_tls_cert_expired: {
    issueDescription: {
      Component: function agentTlsCertExpired({ context, cert }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.agentTlsExpired" values={{ context, cert }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=agent-host-configuration`
  },
  agent_tls_cert_about_to_expire: {
    issueDescription: {
      Component: function agentTlsCertAboutToExpire({ context, cert }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.agentTlsAboutToExpire" values={{ context, cert }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=agent-host-configuration`
  },
  agent_jvm_tls_1_3_missing: {
    issueDescription: {
      Component: function missingTlsVersion() {
        return <span>{t('in-forge:plugins.instanaAgent.tlsProtocolMissingIssue')}</span>;
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: 'https://ibm.biz/insta-hostagenttls13missing'
  },
  default_agent_port_unavailable: {
    issueDescription: {
      Component: function portUnavailable() {
        return <span>{t('in-forge:plugins.process.portUnavailableIssueDescription')}</span>;
      }
    },
    explanationLinkLabel: t('in-forge:plugins.process.troubleshootingDocs'),
    explanationLinkHref: 'https://ibm.biz/insta-hostagentcantbind'
  },
  remote_third_party_api_err: {
    issueDescription: {
      Component: function remoteThirdPartyApiErr({ plugin, code }) {
        // plugin = Remote Third Party sensor name
        // code = HTTP response code received by Remote Third Party sensor
        return (
          <span>
            {
              <p>
                <Trans i18nKey="in-forge:plugins.remoteThirdParty.api_err" values={{ plugin: plugin, code: code }} />
              </p>
            }
          </span>
        );
      }
    },
    // TODO Third party sensor troubleshooting doc page needs to be made and linked here
    explanationLinkLabel: t('in-forge:plugins.remoteThirdParty.troubleShootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/current?topic=agents-managing-host#troubleshooting`
  },
  remote_third_party_config_err: {
    issueDescription: {
      Component: function remoteThirdPartyConfigErr({ plugin, configField }) {
        // plugin = Remote Third Party sensor name
        // configField = field in the configuration.yaml that needs to be reviewed/fixed
        return (
          <span>
            {
              <p>
                <Trans
                  i18nKey="in-forge:plugins.remoteThirdParty.config_err"
                  values={{ plugin: plugin, configField: configField }}
                />
              </p>
            }
          </span>
        );
      }
    },
    // TODO Third party sensor troubleshooting doc page needs to be made and linked here
    explanationLinkLabel: t('in-forge:plugins.remoteThirdParty.troubleShootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/current?topic=agents-managing-host#troubleshooting`
  },
  remote_third_party_unk_err: {
    issueDescription: {
      Component: function remoteThirdPartyUnknownErr({ plugin }) {
        // plugin = Remote Third Party sensor name
        return (
          <span>
            {
              <p>
                <Trans i18nKey="in-forge:plugins.remoteThirdParty.unknown_api_err" values={{ plugin: plugin }} />
              </p>
            }
          </span>
        );
      }
    },
    // TODO Third party sensor troubleshooting doc page needs to be made and linked here
    explanationLinkLabel: t('in-forge:plugins.remoteThirdParty.troubleShootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/instana-observability/current?topic=agents-managing-host#troubleshooting`
  },
  turbonomic_sensor_exception: {
    issueDescription: {
      Component: function TurbonomicSensorException({ e }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.turbonomicSensorException" values={{ e }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/int-sdks-apis`
  },
  turbonomic_sensor_auth_exception: {
    issueDescription: {
      Component: function TurbonomicSensorAuthException({ e }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.turbonomicSensorException" values={{ e }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/int-sdks-apis`
  },
  turbonomic_sensor_warning: {
    issueDescription: {
      Component: function TurbonomicSensorWarning({ e }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.turbonomicSensorException" values={{ e }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/int-sdks-apis`
  },
  agent_tmp_directory_missing: {
    issueDescription: {
      Component: function missingTmpDirectory({ tmpDirLocation }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.tmpDirectoryMissingIssue" values={{ tmpDirLocation }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/BdvTVF`
  },
  solaris_jspawnhelper_executable_issue: {
    issueDescription: {
      Component: function solarisJspawnhelperExecutableIssue({ path }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.jspawnhelperPermissionIssueDescription" values={{ path }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/troubleshooting-Solaris_JVM_file_permission_issue`
  },
  switch_to_java11: {
    issueDescription: {
      Component: function switchtojava11({ version }) {
        return (
          <span>
            <Trans i18nKey="in-forge:plugins.instanaAgent.switchtoJava11IssueDescription" values={{ version }} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.instanaAgent.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/switch-to-J11`
  }
};
