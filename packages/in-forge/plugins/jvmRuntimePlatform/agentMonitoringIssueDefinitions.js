/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

export default {
  java_8_unmonitored_version: {
    issueDescription: {
      Component: function java8UnmonitoredVersion({ version, unmonitoredVersion }) {
        return (
          <span>
            The Java 8 builds up to 1.8.0_
            {unmonitoredVersion} have several known issues relating to the implementation of lambdas. Due to these
            issues this JVM with version {version} will not be monitored.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/jvm/#java_8_unmonitored_version`
  },
  jvm_incompatible_agent_detected: {
    issueDescription: {
      Component: function javaTraceBannedAgent({ agent, vendor, startupParameter }) {
        return (
          <span>
            This JVM seems to run with {agent} by {vendor} installed (the <code>{startupParameter}</code> parameter is
            provided at startup), which is known to be incompatible with the Instana agent. Tracing will not be enabled
            for this JVM.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/jvm/#jvm_incompatible_agent_detected`
  }
};
