import {find} from 'lodash';

export const fields = window.instana.searchFields;
export const fieldsCategorized = buildCategorizedFields(fields);

function buildCategorizedFields() {
  const tree = {
    name: 'root',
    children: [],
    fields: []
  };

  fields.forEach(field => {
    let path = field.category;
    if (field.context) {
      path = [field.context].concat(path);
    }
    insertField(tree, field, path, 0);
  });

  sortTree(tree);
  return tree;
}


function insertField(node, field, path, i) {
  if (i >= (path.length - 1)) {
    node.fields.push(field);
    return;
  }

  const nextNodeName = path[i];
  let nextNode = find(node.children, childNode => childNode.name === nextNodeName);
  if (!nextNode) {
    nextNode = {
      name: nextNodeName,
      children: [],
      fields: []
    };
    node.children.push(nextNode);
  }

  insertField(nextNode, field, path, i + 1);
}


function sortTree(node) {
  node.children.forEach(sortTree);
  node.children.sort(compareByNameProperty);
  node.fields.sort(compareByKeywordProperty);
}


function compareByNameProperty(a, b) {
  return a.name.localeCompare(b.name);
}


function compareByKeywordProperty(a, b) {
  return a.keyword.localeCompare(b.keyword);
}
