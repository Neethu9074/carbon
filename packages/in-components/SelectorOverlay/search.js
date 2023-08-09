/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import fuzzysort from 'fuzzysort';

// Taken from docs at https://github.com/farzher/fuzzysort#how-to-go-fast--performance-tips
const FUZZY_SEARCH_THRESHOLD = 10_000;

export function search(nodes, query, fuzzy = true) {
  if (!query) {
    return nodes;
  }

  query = query.toLowerCase();
  const result = [];
  searchNodes(nodes, query, result, fuzzy ? fuzzyMatches : matches);
  return result;
}

function searchNodes(nodes, query, result, matcher) {
  nodes.forEach(n => searchNode(n, query, result, matcher));
}

function searchNode(node, query, result, matcher) {
  if (node.children == null || node.children.length === 0) {
    const matchResult = matcher([node.label, node.keywords, node.description, node.tagName], query);
    if (matchResult?.length > 0) {
      result.push(node);
    }
  } else {
    searchNodes(node.children, query, result, matcher);
  }
}

function fuzzyMatches(targets, query) {
  // Uses https://github.com/farzher/fuzzysort
  return fuzzysort.go(query, targets, {
    threshold: -FUZZY_SEARCH_THRESHOLD // Don't return matches worse than this (higher is faster)
  });
}

function matches(target, query) {
  if (Array.isArray(target)) {
    return target.flatMap(t => matches(t, query));
  }
  if (target?.toLowerCase().includes(query)) {
    return [target];
  } else {
    return [];
  }
}
