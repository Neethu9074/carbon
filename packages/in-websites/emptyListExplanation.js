/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default function changeExplanation(explanation, { tagFilters, query }) {
  if (tagFilters && tagFilters.length > 1) {
    explanation = `${explanation} matching your filters`;
  }
  if (query && query.length > 1) {
    explanation = `${explanation} and query`;
  }
  return explanation;
}
