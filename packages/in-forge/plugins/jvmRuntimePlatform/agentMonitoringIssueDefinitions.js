import React from 'react';

export default {
  java_8_unmonitored_version: {
    issueDescription: {
      Component: function java8UnmonitoredVersion({ version, unmonitoredVersion }) {
        return (
          <span>
            The Java 8 builds up to 1.8.0_{unmonitoredVersion} have several known issues relating to the implementation of lambdas. Due to
            these issues this JVM with version {version} will not be monitored.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/jvm#java_8_unmonitored_version`
  },
  java_8_outdated_version: {
    issueDescription: {
      Component: function java8OutdatedVersion({ version, recommendedVersion }) {
        return (
          <span>
            The version {version} of this JVM process is outdated.{' '}
            Java 8 versions older than 1.8.0_{recommendedVersion} have several known bugs that may affect, among others, the G1 garbage collector and the Instrumentation API.{' '}
            We recommend to update to the latest Java 8 version or to another Java Long Term Support release.
          </span>
        );
      }
    },
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/jvm#java_8_outdated_version`
  }
};
