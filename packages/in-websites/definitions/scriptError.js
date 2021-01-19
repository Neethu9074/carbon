/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const explanation = `
Error type, message and stack trace are inaccessible due to browser security mechanisms, i.e. the
same-origin policy. This typically means that the error was caused by a script that is hosted on an
origin different from the origin of the HTML document. JavaScript files retrieved from
content-delivery networks and advertisement services are most commonly responsible for these.`.trim();

export const learnMoreLabel = `Learn how to get visibility into these errors`;
export const learnMoreHref = `https://instana.com/docs/website_monitoring/api/#insights-into-script-errors`;

export function isScriptError(errorMessage) {
  return /^Script Error\.?/i.test(errorMessage);
}
