/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

// Prompt library information for helpful queries
// Currently this EventsPromptLibrary is being read inside the AIChat/utils/utils
export const DashboardPromptLibrary = [
  {
    kind: 'Big number',
    questions: [
      'Create a big number widget showing the average latency of <service name>',
      'Show me the number of database calls made to <service name>',
      'Create a big number widget that shows all calls made to the endpoint <endpoint name> of <service name> service'
    ]
  },
  {
    kind: 'Chart: time series',
    questions: [
      'Show me erroneous calls of type HTTP in <application name> over time',
      'Create a time series chart showing sum of calls of type HTTP in <application name>',
      'Create a time series chart showing mean latency for <type> calls in <application name>'
    ]
  },
  {
    kind: 'SLO',
    questions: ['Create an SLO widget for <SLO config name>', 'Create a widget for SLO configuration <SLO config name>']
  }
];
