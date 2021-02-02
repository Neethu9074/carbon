/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export default function changeExplanation(explanation, { tagFilters, query }) {
  if (tagFilters && tagFilters.length > 1) {
    explanation = t('in-websites:emptyListExplanationMatchingYourFilters', { explanation: explanation });
  }
  if (query && query.length > 1) {
    explanation = t('in-websites:emptyListExplanationAndQuery', { explanation: explanation });
  }
  return explanation;
}
