/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
    if (matches(node, query)) {
      result.push(node);
    }
  } else {
    searchNodes(node.children, query, result);
  }
}

function matches(leaf, query) {
  if (leaf.keywords && leaf.keywords.toLowerCase().indexOf(query) !== -1) {
    return true;
  }

  if (typeof leaf.label === 'string' && leaf.label.toLowerCase().indexOf(query) !== -1) {
    return true;
  }

  if (typeof leaf.description === 'string' && leaf.description.toLowerCase().indexOf(query) !== -1) {
    return true;
  }

  return false;
}
