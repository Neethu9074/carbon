/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export const frameworkTypes = {
  MPA: 'mpa',
  SPA: 'spa'
};
export const pageTransitionMethods = {
  PAGE_TITLE: 'pageTitle',
  PAGE_URL: 'pageUrl'
};
export const defaultMappingRule = { id: Date.now(), rule: '', replaceText: '' };

// URL links
export const applicationFrameworkURL =
  'https://www.ibm.com/docs/en/instana-observability/current?topic=websites-website-monitoring-faq#terminology';
export const autoDetectionURL =
  'https://www.ibm.com/docs/en/instana-observability/current?topic=websites-javascript-agent-api#automatic-page-detection-public-preview';

// Utility function to check if a string is a valid regex
export const isValidRegex = (value: string) => {
  const regexPattern = /[.*+?^${}()|[\]\\]/;
  try {
    return regexPattern.test(value) && new RegExp(value);
  } catch {
    return false;
  }
};
