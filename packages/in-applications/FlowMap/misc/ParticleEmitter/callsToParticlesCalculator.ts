/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default function calculate(calls) {
  if (!calls || calls < 0) {
    return 0;
  }

  return Math.log10(calls);
}
