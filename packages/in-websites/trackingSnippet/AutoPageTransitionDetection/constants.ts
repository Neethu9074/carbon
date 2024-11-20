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
export const applicationFrameworkURL = 'https://ibm.biz/web-FAQ';
export const autoDetectionURL = 'https://ibm.biz/page-detection';
export const mappingRuleURL = 'https://ibm.biz/logical-page';

// Checks if the input string is a valid regular expression with delimiters.
export function isValidRegexWithDelimiter(input: string) {
  const regexWithDelimiterPattern = /^\/(.+)\/([gimsuy]*)$/;

  const match = input.match(regexWithDelimiterPattern);
  if (!match) return false;

  try {
    new RegExp(match[1], match[2]);
    return true;
  } catch (e) {
    return false;
  }
}
