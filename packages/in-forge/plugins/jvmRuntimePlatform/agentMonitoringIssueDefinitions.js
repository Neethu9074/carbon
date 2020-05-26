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
    explanationLinkLabel: `Docs`,
    explanationLinkHref: `https://docs.instana.io/ecosystem/jvm#java_8_unmonitored_version`
  }
};
