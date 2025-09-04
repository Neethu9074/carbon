/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

// Prompt library information for helpful queries
// Currently this EventsPromptLibrary is being read inside the AIChat/utils/utils
export const EventsPromptLibrary = [
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
