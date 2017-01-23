import {parse, toString} from 'lucene';
import {assign} from 'lodash';


export function removeField(query, fieldName, value=undefined) {
  const fieldMatcher = buildFieldMatcher(fieldName, value);

  const newAst = manipulate(parse(query), node => fieldMatcher(node) ? null : node);

  if (newAst == null) {
    return '';
  }

  return toString(newAst);
}


export function containsField(query, fieldName, value=undefined) {
  const fieldMatcher = buildFieldMatcher(fieldName, value);
  return Boolean(reduce(parse(query), (hasField, node) => hasField || fieldMatcher(node), false));
}


export function setField(query, fieldName, value) {
  if (containsField(query, fieldName, value)) {
    return query;
  }

  const astForField = {field: fieldName, term: value, quoted: true};

  let ast = parse(query);
  if (ast.left && !ast.right) {
    if (!ast.operator) {
      ast.operator = '<implicit>';
    }
    ast.right = astForField;
  } else {
    ast = {
      left: ast,
      operator: '<implicit>',
      right: astForField
    };
  }

  return toString(ast);
}


function buildFieldMatcher(fieldName, value=undefined) {
  const lowerCasedFieldName = fieldName.toLowerCase();
  const lowerCasedValue = typeof value === 'string' ? value.toLowerCase() : value;
  return node => {
    return node.field &&
        node.field.toLowerCase() === lowerCasedFieldName &&
        (lowerCasedValue === undefined || node.term.toLowerCase() === lowerCasedValue);
  };
}


function manipulate(ast, visitor) {
  if (ast.field) {
    return visitor(ast);
  }

  let left;
  if (ast.left) {
    left = manipulate(ast.left, visitor);
  }

  let right;
  if (ast.right) {
    right = manipulate(ast.right, visitor);
  }

  if (!left && !right) {
    return null;
  } else if (left && !right) {
    return left;
  } else if (!left && right) {
    return right;
  }

  const newAstNode = assign({}, ast);
  newAstNode.left = left;
  newAstNode.right = right;
  return visitor(newAstNode);
}


function reduce(ast, reducer, initialValue) {
  let reduced = initialValue;

  if (ast.left) {
    reduced = reduce(ast.left, reducer, reduced);
  }

  reduced = reducer(reduced, ast);

  if (ast.right) {
    reduced = reduce(ast.right, reducer, reduced);
  }

  return reduced;
}
