/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
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
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=technologies-monitoring-host#ebpf-not-supported`
  },
  agent_log4j_vulnerability: {
    issueDescription: {
      Component: function agentLog4jVulnerability() {
        return <span>{t('in-forge:plugins.host.theHostAgentIsVulnerableToLog4jCVE')}</span>;
      }
    },
    explanationLinkLabel: t('in-forge:plugins.host.troubleshootingDocs'),
    explanationLinkHref: `https://www.ibm.com/docs/en/obi/current?topic=agent-managing-host-agents#instana-agent-contains-vulnerable-log4j-library`
  }
};
