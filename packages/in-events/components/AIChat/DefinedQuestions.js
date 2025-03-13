/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { automationActionAiGenerationUnitEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

const WELCOME_TEXT = t('in-events:aichat.welcome');

const CONSENT_PROMPT = {
  text: t('in-events:aichat.youMustAccept'),
  action: t('in-events:aichat.reviewAction'),
  href: 'https://early-access.ibm.com/software/support/trial/cst/welcomepage.wss?siteId=2175&tabId=6106&w=1&_gl=1*a8q9zh*_ga*NDA2OTcyMzgyLjE3MTEzODYwOTA.*_ga_FYECCCS21D*MTc0MTM0MzI4NS41MS4xLjE3NDEzNDM5NjUuMC4wLjA'
};

// These are the questions that will require additional questions to follow
// Meaning we might have to ask specifics on Date and time
export const DefinedTreeQuestions = [CONSENT_PROMPT.action];

export const AIConsentPrompt = [
  {
    response_type: 'text',
    text: CONSENT_PROMPT.text
  },
  {
    response_type: 'option',
    options: [
      {
        label: CONSENT_PROMPT.action,
        value: {
          input: {
            text: CONSENT_PROMPT.action
          }
        }
      }
    ]
  }
];

export const InitialLoadOptions = [
  {
    response_type: 'text',
    text: WELCOME_TEXT
  },
  {
    response_type: 'user_defined',
    user_defined: {
      user_defined_type: 'editable_options',
      options: [
        {
          key: 'apps',
          value: t('in-events:aichat.apps')
        },
        {
          key: 'infra',
          value: t('in-events:aichat.infra')
        }
      ],
      /* nl2api chat model currently only supports English, should not be translated */
      infra: [
        {
          key: 'DB2',
          value: 'Show total number of failed queries to db2 database with host name ABC'
        },
        {
          key: 'JVM Runtime',
          value:
            'Get the total number of runnable threads, new threads, and threads in timed-waiting for all JVMs running on namespace XYZ.'
        },
        {
          key: 'IBM MQ',
          value: 'Show top 3 queues with highest queue depth for last 60 minutes group by queue name.'
        },
        {
          key: 'K8s Deployment',
          value:
            'What is the sum of aggregated cpu requests for kubernetes deployment APP-1 in namespace NAMESPACE-1 for last 2 hours?'
        },
        {
          key: 'K8s pod',
          value: 'What is the count of pods for deployments labeled as environment=envABC in the namespace nameXYZ?'
        }
      ],
      apps: [
        {
          key: 'Slow calls',
          value: 'Show me calls with high latency for service <service-name> in app <app-name>'
        },
        {
          key: 'Erroneous calls',
          value: 'Show me erroneous calls for service <service-a>'
        },
        {
          key: 'HTTP status codes',
          value: 'Show me calls with status code 5XX received by <service-a>'
        },
        {
          key: 'Throughput',
          value: 'Show me calls which spiked in last <duration> minutes in <service-a> '
        }
      ]
    }
  }
];

export function handleDefinedTreeQuestions(request, instance) {
  if (!automationActionAiGenerationUnitEnabled) {
    if (request.input.text === CONSENT_PROMPT.action) {
      window.open(CONSENT_PROMPT.href, '_blank');
      instance.messaging.addMessage({
        output: {
          generic: [
            {
              response_type: 'text',
              text: t('in-events:aichat.openingAgreement', { href: CONSENT_PROMPT.href })
            }
          ]
        }
      });
    }
    return;
  }
  switch (request.input.text) {
    default:
      instance.messaging.addMessage({
        output: {
          generic: InitialLoadOptions
        }
      });
  }
}
