/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { t } from 'in-i18n';

export default {
  ebpf_not_supported: {
    issueDescription: {
      Component: function epbfNotSupported() {
        return (
          <span>
            {t(
              'in-forge:plugins.host.theOperatingSystemOfThisHostDoesNotSeemToOfferTheExtendedBerkeleyPacketFilterEBpfFunctionality'
            )}
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.host.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/host-ebpf`
  },
  agent_log4j_vulnerability: {
    issueDescription: {
      Component: function agentLog4jVulnerability() {
        return <span>{t('in-forge:plugins.host.theHostAgentIsVulnerableToLog4jCVE')}</span>;
      }
    },
    explanationLinkLabel: t('in-forge:plugins.host.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/insta-aglog4jvulnerable`
  },
  data_processing_issue_agent_message_filtered: {
    issueDescription: {
      Component: function ({ reason }) {
        return (
          <>
            <div>{t('in-forge:plugins.host.messagesAreBeingFilteredFromThisHost')}</div>
            <div>{reason ?? 'The rationale for filtering was not provided'}</div>
          </>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.host.troubleshootingDocs'),
    explanationLinkHref: 'https://www.ibm.com/docs/en/instana-observability/latest'
  }
};
