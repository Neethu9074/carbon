/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { compare } from 'in-services/util/number';

/**
 + Constant timestamp used within storybook to create always the same ui.
 */
export const fixedTimestamp = 1600667400000;

/**
 * Recreate always the same number of random values.
 */
export function generateMetrics(numMetrics, maxValue, windowSize) {
  const granularity = windowSize / numMetrics;
  const metrics = [];
  for (let i = numMetrics - 1; i >= 0; i--) {
    let timestamp = Math.floor((fixedTimestamp - (i + 1) * (windowSize / numMetrics)) / granularity) * granularity;
    metrics[i] = [timestamp, ((getHardCodedRandomValue(i) * maxValue * 100) | 0) / 100];
  }
  metrics.sort((a, b) => compare(a[0], b[0]));
  return metrics;
}

/**
 * Retrieve a number from the list of pre-calculated random numbers, base on the given index.
 * The list is repeating endlessly [arr][arr][arr]...
 * @param idx !integer number - index into the list of number, could be any number from 0 to e.g. 30
 * @returns {number}
 */
export function getHardCodedRandomValue(idx) {
  return hardCodedRandomValues[idx % hardCodedRandomValues.length];
}

// 30 random values, generated via
// console.log(Array(30).fill(0).map(()=>Math.random()))
const hardCodedRandomValues = [
  0.8697433817604485,
  0.07438031121676358,
  0.7400482226489384,
  0.48015413646212446,
  0.6509602522666735,
  0.8683069953822651,
  0.7192785445633163,
  0.9260051899571204,
  0.6206556315581626,
  0.3137005733505238,
  0.4991750351117612,
  0.923405261657759,
  0.8311512802824517,
  0.12013556360617716,
  0.9776056037578202,
  0.26022966490463584,
  0.9902931774735453,
  0.6784025517811636,
  0.42162611884038537,
  0.4222809869652495,
  0.9187470584987032,
  0.98381966210266,
  0.18752004248701692,
  0.21704220599119584,
  0.2625905595057456,
  0.3648259834375791,
  0.5631348558045699,
  0.9590451981916723,
  0.39936423468845916,
  0.5149024801497686
];
