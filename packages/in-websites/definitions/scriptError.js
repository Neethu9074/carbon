/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const explanation = t('in-websites:definitions.scriptErrorExplanation').trim();

export const learnMoreLabel = t('in-websites:definitions.scriptErrorLearnMoreLabel');
export const learnMoreHref = `https://www.ibm.com/docs/en/obi/current?topic=websites-javascript-agent-api#insights-into-script-errors`;

export function isScriptError(errorMessage) {
  return /^Script Error\.?/i.test(errorMessage);
}
