/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t, Trans } from 'in-i18n';

export default {
  java_8_unmonitored_version: {
    issueDescription: {
      Component: function java8UnmonitoredVersion({ version, unmonitoredVersion }) {
        return (
          <span>
            {t('in-forge:plugins.jvmRuntimePlatform.theJava8BuildsUpTo180HaveSeveralKnownIssues', {
              unmonitoredVersion: unmonitoredVersion,
              version: version
            })}
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.jvmRuntimePlatform.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/insta-unsupportedjvm8`
  },
  jvm_incompatible_agent_detected: {
    issueDescription: {
      Component: function javaTraceBannedAgent({ agent, vendor, startupParameter }) {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.jvmRuntimePlatform.thisJvmIsKnownToBeIncompatibleWithTheInstanaAgent"
              values={{
                agent: agent,
                vendor: vendor,
                startupParameter: startupParameter
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.jvmRuntimePlatform.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/insta-incompagent`
  },
  invalid_jmx_credentials: {
    issueDescription: {
      Component: function invalidJmxCredentials() {
        return (
          <span>
            <p>
              <Trans i18nKey="in-forge:plugins.kafka.kafkaMonitoringRequiresJmxAuthentication" />
            </p>
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.kafka.troubleshootingDocs'),
    explanationLinkHref: `https://ibm.biz/kafka-ssl-client-auth-not-config`
  }
};
