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
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net/#clr_instana_pcp_not_running`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/dot-net/#clr_instana_pcp_not_connected`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/python/troubleshooting/#python_autotrace_prerequisites_failed`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/datapower/#ibmdatapower_var_not_defined`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/datapower/#ibmdatapower_var_invalid_value`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/datapower/#ibmdatapower_connection_error`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/datapower/#ibmdatapower_exception_error`
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
    explanationLinkHref: `https://www.instana.com/docs/setup_and_manage/host_agent`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/ibm-apmproxy/#apmproxy_missing_config`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/ibm-apmproxy/#apmproxy_connection_error`
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
    explanationLinkHref: `https://instana.com/docs/ecosystem/ibm-apmproxy/#apmproxy_exception_error`
  }
};
