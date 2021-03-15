/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default function calculate(calls) {
  if (!calls || calls <= 0) {
    return 0;
  }

  // this avoids the log to produce negative or too small values. Also it adds a min rate which is here log2(1.125) =
  calls += 1.125;
  calls = Math.log2(calls);
  return calls;
}
