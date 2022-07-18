/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import fuzzysort from 'fuzzysort';

// Taken from docs at https://github.com/farzher/fuzzysort#how-to-go-fast--performance-tips
const FUZZY_SEARCH_THRESHOLD = 10_000;

export function search(nodes, query) {
  if (!query) {
    return nodes;
  }

  query = query.toLowerCase();
  const result = [];
  searchNodes(nodes, query, result);
  return result;
}

function searchNodes(nodes, query, result) {
  nodes.forEach(n => searchNode(n, query, result));
}

function searchNode(node, query, result) {
  if (node.children == null || node.children.length === 0) {
    const matchResult = matches(node, query);
    if (matchResult?.length > 0) {
      result.push(node);
    }
  } else {
    searchNodes(node.children, query, result);
  }
}

function matches(leaf, query) {
  // Uses https://github.com/farzher/fuzzysort
  return fuzzysort.go(query, [leaf.label, leaf.keywords, leaf.description, leaf.tagName], {
    threshold: -FUZZY_SEARCH_THRESHOLD // Don't return matches worse than this (higher is faster)
  });
}
