import {
  createTagFilter,
  CLOSE_BRACKET,
  OPEN_BRACKET,
  TAG,
  CONJUNCTION
} from 'in-new-components/QueryBuilder/transformation/formModel';

export const EXPRESSION = 'EXPRESSION';

export const OPERATOR_OR = 'OR';
export const OPERATOR_AND = 'AND';
export const OPERATOR_NOT = 'NOT';

export function toBackendQueryModel(formModel) {
  if (!formModel || formModel.length === 0) {
    return createTagFilterExpression(OPERATOR_OR, []);
  }

  return mapTags(formModel);
}

function mapTags(tags) {
  return collectExpression(tags, 0).expression.elements[0];
}

function collectExpression(tags, cursor) {
  let logicalOperator = OPERATOR_OR;
  const elements = [];

  while (cursor < tags.length) {
    const tag = tags[cursor++];

    if (tag.type === CLOSE_BRACKET) {
      break;
    }
    if (tag.type === OPEN_BRACKET) {
      const result = collectExpression(tags, cursor);
      elements.push(result.expression);
      cursor = result.cursor;
    } else if (tag.type === TAG) {
      elements.push(createTagFilter(tag));
    } else if (tag.type === CONJUNCTION) {
      logicalOperator = tag.logicalOperator;
    }
  }

  const expression = createTagFilterExpression(logicalOperator, elements);
  return {
    cursor,
    expression
  };
}

function createTagFilterExpression(logicalOperator, elements) {
  return {
    type: EXPRESSION,
    logicalOperator,
    elements
  };
}
