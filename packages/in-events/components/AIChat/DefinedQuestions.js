/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { automationActionAiGenerationUnitEnabled } from 'in-services/featureFlags';
import { EVENT_AI_CLICK_EPWT_LINK } from 'in-services/tracking/tracking';
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

export const promptLibrary = [
  {
    kind: 'Application',
    questions: [
      'Show me calls with high latency for service <service-name> in app <app-name>.',
      'Show me erroneous calls for service <service-name>.',
      'Show me calls with status code 5XX received by service <service-name>.',
      'Show me calls which spiked in last <duration> minutes in service <service-name>.'
    ]
  },
  {
    kind: 'Infrastructure',
    questions: [
      'Show me the total number of failed queries to DB2 database with host name <host-name>.',
      'Show me the total number of runnable threads, new threads, and threads in timed-waiting for all JVMs running on namespace <namespace-name>.',
      'Show me the top <number> queues with highest queue depth for last <duration> minutes group. Group by queue name.',
      'What is the sum of aggregated CPU requests for kubernetes deployment <app-name> in namespace <namespace-name> for last <duration> hours?',
      'What is the count of pods for deployments labeled as environment=<environment-name> in the namespace <namespace-name>?',
      'Show me the total number of failed queries to DB2 database with host name <host-name>.',
      'Show me the total number of runnable threads, new threads, and threads in timed-waiting for all JVMs running on namespace <namespace-name>.',
      'Show me the top <number> queues with highest queue depth for last <duration> minutes group. Group by queue name.',
      'What is the sum of aggregated CPU requests for kubernetes deployment <app-name> in namespace <namespace-name> for last <duration> hours?',
      'What is the count of pods for deployments labeled as environment=<environment-name> in the namespace <namespace-name>?'
    ]
  }
];

// This is our user type prompt_library that will ultimately invoke
// our CustomResponse/PromptBubble
export const promptLibraryBubble = {
  response_type: 'user_defined',
  user_defined: {
    user_defined_type: 'prompt_library'
  }
};

export const technologyOptions = {
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
        value: 'Show me the total number of failed queries to DB2 database with host name <host-name>'
      },
      {
        key: 'JVM Runtime',
        value:
          'Show me the total number of runnable threads, new threads, and threads in timed-waiting for all JVMs running on namespace <namespace-name>.'
      },
      {
        key: 'IBM MQ',
        value:
          'Show me the top <number> queues with highest queue depth for last <duration> minutes group. Group by queue name.'
      },
      {
        key: 'K8s Deployment',
        value:
          'What is the sum of aggregated CPU requests for kubernetes deployment <app-name> in namespace <namespace-name> for last <duration> hours?'
      },
      {
        key: 'K8s pod',
        value:
          'What is the count of pods for deployments labeled as environment=<environment-name> in the namespace <namespace-name>?'
      }
    ],
    apps: [
      {
        key: 'Slow calls',
        value: 'Show me calls with high latency for service <service-name> in app <app-name>'
      },
      {
        key: 'Erroneous calls',
        value: 'Show me erroneous calls for service <service-name>'
      },
      {
        key: 'HTTP status codes',
        value: 'Show me calls with status code 5XX received by service <service-name>'
      },
      {
        key: 'Throughput',
        value: 'Show me calls which spiked in last <duration> minutes in service <service-name>'
      }
    ]
  }
};

export const reprompt = [
  {
    response_type: 'text',
    text: t('in-events:aichat.anyOtherQs')
  } //,
  //technologyOptions
];

export const InitialLoadOptions = [
  {
    response_type: 'text',
    text: WELCOME_TEXT
  },
  promptLibraryBubble
];

export function handleDefinedTreeQuestions(request, instance, trackCta) {
  if (!automationActionAiGenerationUnitEnabled) {
    if (request.input.text === CONSENT_PROMPT.action) {
      window.open(CONSENT_PROMPT.href, '_blank');
      trackCta?.(EVENT_AI_CLICK_EPWT_LINK, {});
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
