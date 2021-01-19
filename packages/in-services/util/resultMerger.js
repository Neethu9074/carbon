/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { indeterminateProgress, emptyArray, finishedProgress } from 'in-services/fixedObjects';

export function merge(results, mergeResultData) {
  if (isAllFinished(results)) {
    return mergeFinished(results, mergeResultData);
  } else if (hasErrors(results)) {
    return mergeErrors(results);
  }
  return mergeProgress(results);
}

function isAllFinished(results) {
  for (const result of results) {
    if (result.progress.loading || result.errors.length !== 0) {
      return false;
    }
  }
  return true;
}

function mergeFinished(results, mergeResultData) {
  const maxTime = results.reduce((agg, result) => Math.max(result.time, agg), 0);
  return {
    data: mergeResultData(results.map(result => result.data)),
    errors: emptyArray,
    time: maxTime,
    progress: finishedProgress
  };
}

function hasErrors(results) {
  for (const result of results) {
    if (result.errors.length > 0) {
      return true;
    }
  }
  return false;
}

function mergeErrors(results) {
  let errors = [];
  for (const result of results) {
    errors = [...errors, ...result.errors];
  }
  return {
    errors,
    progress: finishedProgress
  };
}

function mergeProgress(results) {
  let smallestProgress = null;
  for (const result of results) {
    if (!result.progress.loading) {
      // Not loading – do not include in progress state.
      continue;
    } else if (smallestProgress == null) {
      smallestProgress = result.progress;
      continue;
    } else if (smallestProgress.percentage == null || result.progress.percentage == null) {
      // Whenever we encounter a single indeterminate process we have to assume that the total loading
      // state has to be an indeterminate one.
      smallestProgress = indeterminateProgress;
      // No need to carry on searching as we cannot provide a better result.
      break;
    }

    const percentage = Math.min(smallestProgress.percentage, result.progress.percentage);
    smallestProgress = {
      percentage,
      loading: true
    };
  }
  return {
    progress: smallestProgress,
    errors: emptyArray
  };
}
