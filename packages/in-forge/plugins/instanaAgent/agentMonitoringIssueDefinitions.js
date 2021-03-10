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
  }
};
