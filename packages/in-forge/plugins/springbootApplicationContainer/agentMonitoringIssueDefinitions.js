/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Code from 'in-components/Code';
import { Trans, t } from 'in-i18n';

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
            <p>{t('in-forge:plugins.springbootAppContainer.descriptionActuatorConfigured')}</p>
            <Code code={ActuatorDependencyCode} lang="html" showLineNumbers={false} />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.springbootAppContainer.labelTroubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/spring-boot/#springboot_actuator_not_configured`
  },
  springboot_jmx_not_enabled: {
    issueDescription: {
      Component: function springbootJmxNotEnabled() {
        return (
          <span>
            <Trans
              i18nKey="in-forge:plugins.springbootAppContainer.descriptionEnableJMX"
              components={{
                codeTag: <code />,
                bold: <b />
              }}
            />
          </span>
        );
      }
    },
    explanationLinkLabel: t('in-forge:plugins.springbootAppContainer.labelTroubleshootingDocs'),
    explanationLinkHref: `https://instana.com/docs/ecosystem/spring-boot/#springboot_jmx_not_enabled`
  }
};
