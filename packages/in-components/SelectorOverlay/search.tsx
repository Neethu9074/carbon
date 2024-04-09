/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import fuzzysort from 'fuzzysort';
import React from 'react';

import { Options } from 'in-components/TagSelectorOverlay/TagSelectorOverlay';

import nodeLocals from './Node.mless';

// Taken from docs at https://github.com/farzher/fuzzysort#how-to-go-fast--performance-tips
const RANGE = 200;
const FUZZY_SEARCH_THRESHOLD = (1 + 2 + 3 + 4 + 5 + 6) * RANGE;
const KEYS = ['label', 'description', 'parentLabels.0', 'parentLabels.1', 'keywords', 'tagName'];

export function search(nodes: Options[], query: string) {
  if (!query) {
    return nodes;
  }

  query = query.toLowerCase();
  const result: Options[] = [];
  searchNodes(nodes, query, result, fuzzyMatches);
  return result;
}

type Matcher = (targets: Options[], query: string) => Fuzzysort.KeysResults<Options>;

function searchNodes(nodes: Options[], query: string, result: Options[], matcher: Matcher) {
  const allNodes = flattenNodes(nodes);
  const matchResults = matcher(allNodes, query);
  matchResults
    .filter(matchResult => matchResult?.score > -FUZZY_SEARCH_THRESHOLD)
    .forEach(matchResult => result.push(highlight(matchResult)));
}

function flattenNodes(nodes: Options[]): Options[] {
  return nodes.flatMap(node => {
    if (node.children && node.children.length > 0) {
      return flattenNodes(node.children);
    }
    return [node];
  });
}

function fuzzyMatches(targets: Options[], query: string): Fuzzysort.KeysResults<Options> {
  // Uses https://github.com/farzher/fuzzysort
  return fuzzysort.go(query, targets, {
    threshold: -FUZZY_SEARCH_THRESHOLD, // Don't return matches worse than this (higher is faster)
    limit: 5000, // Don't return more results than this (lower is faster)
    keys: KEYS,
    // conversion to unknown to add obj field as it is added before calling scoreFn (see https://github.com/farzher/fuzzysort/blob/c7f1d2674d7fa526015646bc02fd17e29662d30c/fuzzysort.js#L94)
    scoreFn: a =>
      KEYS.map((_, index) => score(a[index], index, (a as unknown as { obj: Options }).obj)).reduce((a, b) => a + b)
  });
}

function score(result: Fuzzysort.KeyResult<Options>, offset: number, matchObj: Options, range: number = RANGE): number {
  if (result) {
    const score = result.score - offset * range;
    if (matchObj.scoreBoost) {
      return score / matchObj.scoreBoost;
    }
    return score;
  }
  return -(offset + 1) * range;
}

function highlight(matchResult: Fuzzysort.KeysResult<Options>): Options {
  var label = highlightResult(matchResult[0]);
  var description = highlightResult(matchResult[1]);
  let parentLabels = [];
  if (matchResult.obj.parentLabels.length > 0) {
    const parentLabel0Highlighted = highlightResult(matchResult[2]);
    parentLabels.push((parentLabel0Highlighted && <>{parentLabel0Highlighted}</>) || matchResult.obj.parentLabels[0]);
    if (matchResult.obj.parentLabels.length > 1) {
      const parentLabel1Highlighted = highlightResult(matchResult[3]);
      parentLabels.push((parentLabel1Highlighted && <>{parentLabel1Highlighted}</>) || matchResult.obj.parentLabels[1]);
    }
  }

  return {
    ...matchResult.obj,
    withHighlights: {
      label: (label && <>{label}</>) || matchResult.obj.label,
      description: (description && <>{description}</>) || matchResult.obj.description,
      parentLabels
    }
  };
}

function highlightResult(result: Fuzzysort.Result): (string | JSX.Element)[] | undefined {
  return fuzzysort
    .highlight(result, (m, i) => (
      <span key={i} className={nodeLocals.highlight}>
        {m}
      </span>
    ))
    ?.filter(x => x !== '');
}
