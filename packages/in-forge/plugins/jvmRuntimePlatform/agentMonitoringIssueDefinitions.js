import React from 'react';

export default {
  java_8u40_not_monitored: {
    issueDescription: {
      Component: function java8u40NotMonitored({ version }) {
        return (
          <span>
            The Java 8 builds up to 1.8.0_40 have several known issues relating to the implementation of lambdas. Due to
            these issues this JVM with version {version} will not be monitored.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/jvm#java_8u40_not_monitored`
  },
  java_8_outdated_version: {
    issueDescription: {
      Component: function java8OutdatedVersion({ version, recommendedVersion }) {
        return (
          <span>
            The version {version} of this JVM process is outdated.{' '}
            Java 8 versions older than 1.8.0_{recommendedVersion} have several known bugs that may affect, among others, the G1 garbage collector and the Instrumentation API.{' '}
            We recommend to update to the latest Java 8 or 11 version.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/jvm#java_8_outdated_version`
  }
};
