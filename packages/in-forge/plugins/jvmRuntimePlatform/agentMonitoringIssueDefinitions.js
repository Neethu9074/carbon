import React from 'react';

export default {
  java_8_outdated_version: {
    issueDescription: {
      Component: function java8OutdatedVersion({ version }) {
        return (
          <span>
            The version {version} of this JVM process is outdated.{' '}
            Java 8 versions older than 1.8.0_252 have several known bugs that may affect, among others, the G1 garbage collector and the Instrumentation API.{' '}
            We recommend to update to the latest Java 8 or 11 version.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/jvm#java_8_outdated_version`
  }
};
