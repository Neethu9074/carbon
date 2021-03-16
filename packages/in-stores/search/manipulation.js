/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { parse, toString } from 'lucene';
import { assign } from 'lodash';

const implicitMarker = '<implicit>';

export function removeField(query, fieldName, value = undefined) {
  const fieldMatcher = buildFieldMatcher(fieldName, value);

  const newAst = manipulate(parse(query), node => (fieldMatcher(node) ? null : node));

  if (newAst == null) {
    return '';
  }

  return toString(newAst);
}

export function containsField(query, fieldName, value = undefined) {
  const fieldMatcher = buildFieldMatcher(fieldName, value);
  return Boolean(reduce(parse(query), (hasField, node) => hasField || fieldMatcher(node), false));
}

export function setField(query, fieldName, value) {
  if (containsField(query, fieldName, value)) {
    return query;
  }

  const escapedValue = luceneEscapeString(value);
  const astForField = { field: fieldName, term: escapedValue, quoted: requiresQuotes(escapedValue) };

  let ast = parse(query);
  if (ast.left && !ast.right) {
    if (!ast.operator) {
      ast.operator = implicitMarker;
    }
    ast.right = astForField;
  } else {
    ast = {
      left: ast,
      operator: implicitMarker,
      right: astForField
    };
  }

  return toString(ast);
}

export function getFieldTerms(query, fieldName) {
  const fieldMatcher = buildFieldMatcher(fieldName);
  return reduce(
    parse(query),
    (agg, node) => {
      if (fieldMatcher(node)) {
        if (typeof node.term === 'string') {
          agg.push(luceneUnescapeString(node.term));
        } else {
          if (node.left) {
            reduce(node.left, implicitFieldTermAdder, agg);
          }
          if (node.right) {
            reduce(node.right, implicitFieldTermAdder, agg);
          }
        }
      }
      return agg;
    },
    []
  );
}

function implicitFieldTermAdder(agg, node) {
  if (node.field === implicitMarker && typeof node.term === 'string') {
    agg.push(luceneUnescapeString(node.term));
  }
  return agg;
}

export function luceneEscapeString(s) {
  return s.replace(/[+\\!(){}[\]^"?:\\&|'/]/g, c => {
    return `\\${c}`;
  });
}

function luceneUnescapeString(s) {
  return s.replace(/\\([+\\!(){}[\]^"?:\\&|'/])/g, (m, c) => c);
}

export function requiresQuotes(s) {
  return s.indexOf(' ') !== -1 || s.indexOf('\\') !== -1;
}

function buildFieldMatcher(fieldName, value = undefined) {
  const lowerCasedFieldName = fieldName.toLowerCase();
  const lowerCasedValue = typeof value === 'string' ? luceneEscapeString(value.toLowerCase()) : value;
  return node =>
    !!node.field &&
    node.field.toLowerCase() === lowerCasedFieldName &&
    (lowerCasedValue === undefined || node.term.toLowerCase() === lowerCasedValue);
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
