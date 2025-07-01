/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

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
      'What is the count of pods for deployments labeled as environment=<environment-name> in the namespace <namespace-name>?'
    ]
  },
  {
    kind: 'Events',
    questions: [
      'What are todays open incidents for app <app-name>?',
      'List all the incidents in the last hour grouped by app <app-name>.',
      'How many incidents have occurred on service <service-name> in the last week?',
      'How many application events generated in the last 45 minutes had a "high error rate" problem.',
      'Show me kubernetes pod changes grouped by label <label>.',
      'How many JVM incidents are still open?',
      'Show me closed incidents from the last <number> days?'
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
  }
];

export const InitialLoadOptions = [
  {
    response_type: 'text',
    text: WELCOME_TEXT
  },
  promptLibraryBubble
];

export function handleDefinedTreeQuestions(request, instance) {
  switch (request.input.text) {
    default:
      instance.messaging.addMessage({
        output: {
          generic: InitialLoadOptions
        }
      });
  }
}
