/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default function countSamples(profile) {
  let totalSamples = profile.numSamples || 0;

  const children = profile.children || [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    totalSamples += countSamples(child);
  }

  return totalSamples;
}
