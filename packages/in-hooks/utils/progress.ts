/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Progress } from '@instana/types';
function calcPercentageAverage(progress: Progress[]): number {
  const sumProgresses = progress
    .map(({ percentage }) => percentage)
    .reduce<number>((prevPercentage, curPercentage) => prevPercentage + curPercentage!, 0);
  const average = sumProgresses / progress.length;
  return parseFloat(Number.parseFloat(`${average}`).toPrecision(1));
}

/**
 * Unifies multiple Progress into one.
 * @param progress Array of Progress which should be unified
 * @returns unified Progress object - optionaly with percentage if all given Progress have percentage
 */

export function all(...progress: Progress[]): Progress {
  const hasLoadingProgress = progress.some(progress => progress.loading);
  const allHavePercentage = progress.every(progress => 'percentage' in progress);
  if (allHavePercentage) return { loading: hasLoadingProgress, percentage: calcPercentageAverage(progress) };
  return { loading: hasLoadingProgress };
}
