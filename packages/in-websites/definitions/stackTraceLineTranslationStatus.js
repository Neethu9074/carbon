export const status = {
  1: {
    explanation: 'Successfully translated',
    shouldShowExplanation: false,
    linkToConfigurationDialog: false
  },
  2: {
    explanation: 'Could not download JavaScript source file because of missing authentication (HTTP status code 401).',
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  3: {
    explanation: 'Could not download JavaScript source file because of failed authorization (HTTP status code 403).',
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  4: {
    explanation: 'Could not download JavScript source file because the file was not found (HTTP status code 404).',
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  5: {
    explanation:
      'Could not download JavaScript source file because the HTTP request failed and was not a 401, 403 or 404.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  6: {
    explanation: 'No reference to source map in HTTP header nor as annotation in JavaScript source file.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  7: {
    explanation: 'An unknown error happened during the identification of the source map file.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  8: {
    explanation: 'Could not download source map file because of missing authentication (HTTP response code 401).',
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  14: {
    explanation: 'Could not download source map file because of failed authorization (HTTP status code 403).',
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  9: {
    explanation: 'Could not download source map file because the file was not found (HTTP status code 404).',
    shouldShowExplanation: true,
    linkToConfigurationDialog: true
  },
  10: {
    explanation: 'Could not download source map file because the HTTP request failed and was not a 401, 403 or 404.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  11: {
    explanation: 'Source map file parsing failed.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  12: {
    explanation: 'An unknown error occurred while processing the source map file.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  13: {
    explanation:
      'Could not find original mapping for a combination of line and column number via the source map. This can happen after releases for users that are running outdated versions of your JavaScript files.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  15: {
    explanation: 'Translation is only possible when a reference to a line number is included in the stack trace line.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  16: {
    explanation:
      "This stack trace line's file reference does not point to a JavaScript file. Source map based stack trace line translation only works when the source is a JavaScript file.",
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  17: {
    explanation: 'Could not establish a TCP / TLS connection to the host serving the JavaScript file.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false,
    linkToExternalPage:
      'https://instana.com/docs/website_monitoring/faq/#how-can-i-ensure-that-the-instana-servers-can-establish-a-tcptls-connection'
  },
  18: {
    explanation: 'Could not establish a TCP / TLS connection to the host serving the source map file.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false,
    linkToExternalPage:
      'https://instana.com/docs/website_monitoring/faq/#how-can-i-ensure-that-the-instana-servers-can-establish-a-tcptls-connection'
  },
  19: {
    explanation: 'A request timeout occurred when trying to retrieve the JavaScript file.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  },
  20: {
    explanation: 'A request timeout occurred when trying to retrieve the JavaScript file. source map file.',
    shouldShowExplanation: true,
    linkToConfigurationDialog: false
  }
};
