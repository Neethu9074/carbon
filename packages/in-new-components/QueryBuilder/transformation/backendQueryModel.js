import { CLOSE_BRACKET, OPEN_BRACKET, TAG, CONJUNCTION } from 'in-new-components/QueryBuilder/transformation/formModel';

export const EXPRESSION = 'EXPRESSION';

export const OPERATOR_OR = 'OR';
export const OPERATOR_AND = 'AND';

export function toBackendQueryModel(formModel) {
  if (!formModel || formModel.length === 0) {
    return createTagFilterExpression({ type: EXPRESSION, logicalOperator: OPERATOR_OR, elements: [] });
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

  const expression = createTagFilterExpression({ type: EXPRESSION, logicalOperator, elements });
  return {
    cursor,
    expression
  };
}

function createTagFilter({ type, name, stringValue, numberValue, booleanValue, operator = OPERATOR_OR, entity }) {
  const mappedTag = { type, name, operator, entity };
  if (stringValue !== undefined) {
    mappedTag.stringValue = stringValue;
  }
  if (numberValue !== undefined) {
    mappedTag.numberValue = numberValue;
  }
  if (booleanValue !== undefined) {
    mappedTag.booleanValue = booleanValue;
  }
  return mappedTag;
}

export function createTagFilterExpression({ type, logicalOperator, elements }) {
  return {
    type,
    logicalOperator,
    elements
  };
}
