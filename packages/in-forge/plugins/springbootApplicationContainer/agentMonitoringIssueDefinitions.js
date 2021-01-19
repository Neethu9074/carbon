/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Code from 'in-components/Code';

const ActuatorDependencyCode = `<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
`;

export default {
  springboot_actuator_not_configured: {
    issueDescription: {
      Component: function springbootActuatorNotConfigured() {
        return (
          <span>
            <p>Spring Boot monitoring requires that Spring Boot Actuator is configured:</p>
            <Code code={ActuatorDependencyCode} lang="html" showLineNumbers={false} />
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/spring-boot/#springboot_actuator_not_configured`
  },
  springboot_jmx_not_enabled: {
    issueDescription: {
      Component: function springbootJmxNotEnabled() {
        return (
          <span>
            For Spring Boot 2.2.x and later it is necessary to enable JMX. Set{' '}
            <code>
              <b>spring.jmx.enabled=true</b>
            </code>{' '}
            in the{' '}
            <code>
              <b>application.properties</b>
            </code>{' '}
            file.
          </span>
        );
      }
    },
    explanationLinkLabel: `Troubleshooting docs`,
    explanationLinkHref: `https://instana.com/docs/ecosystem/spring-boot/#springboot_jmx_not_enabled`
  }
};
