/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { escapeRegExp } from 'lodash';

export function search(nodes, query) {
  if (!query) {
    return nodes;
  }

  query = new RegExp(
    query
      .toLowerCase()
      .split(' ')
      .map(escapeRegExp)
      .join('.*'),
    'i'
  );
  const result = [];
  searchNodes(nodes, query, result);
  return result;
}

function searchNodes(nodes, query, result) {
  nodes.forEach(n => searchNode(n, query, result));
}

function searchNode(node, query, result) {
  if (node.children == null || node.children.length === 0) {
    if (matches(node, query)) {
      result.push(node);
    }
  } else {
    searchNodes(node.children, query, result);
  }
}

function matches(leaf, query) {
  if (leaf.keywords && query.test(leaf.keywords.toLowerCase())) {
    return true;
  }

  if (typeof leaf.label === 'string' && query.test(leaf.label.toLowerCase())) {
    return true;
  }

  return typeof leaf.description === 'string' && query.test(leaf.description.toLowerCase());
}
