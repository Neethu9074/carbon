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
const RANGE = 100;
const FUZZY_SEARCH_THRESHOLD = (1 + 2 + 3 + 4) * RANGE;
const KEYS = ['label', 'description', 'keywords', 'tagName'];

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
    scoreFn: a => KEYS.map((_, index) => score(a[index], index)).reduce((a, b) => a + b)
  });
}

function score(result: Fuzzysort.KeyResult<Options>, offset: number, range: number = RANGE): number {
  return result ? result.score - offset * range : -(offset + 1) * range;
}
function highlight(matchResult: Fuzzysort.KeysResult<Options>): Options {
  var label = highlightResult(matchResult[0]);
  var description = highlightResult(matchResult[1]);
  return {
    ...matchResult.obj,
    withHighlights: {
      label: (label && <>{label}</>) || matchResult.obj.label,
      description: (description && <>{description}</>) || matchResult.obj.description
    }
  };
}

function highlightResult(result: Fuzzysort.Result): (string | JSX.Element)[] | undefined {
  return fuzzysort.highlight(result, m => <span className={nodeLocals.highlight}>{m}</span>)?.filter(x => x !== '');
}
