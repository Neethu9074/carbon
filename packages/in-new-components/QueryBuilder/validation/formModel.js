import {
  TAG as TAG_TYPE,
  OPEN_BRACKET as OPEN_BRACKET_TYPE,
  CLOSE_BRACKET as CLOSE_BRACKET_TYPE,
  CONJUNCTION as CONJUNCTION_TYPE
} from 'in-new-components/QueryBuilder/transformation/formModel';
import {
  OPERATOR_NOT,
  OPERATOR_AND,
  OPERATOR_OR
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { createTagForm } from 'in-new-components/QueryBuilder/validation/tagForm';

export function isFormModelValid({ tagCatalog, formModel }) {
  if (!(formModel instanceof Array)) {
    return false;
  }

  let numberOfOpenedBrackets = 0;
  let i = 0;
  for (const element of formModel) {
    const previousElement = formModel[i - 1];
    const nextElement = formModel[i + 1];
    i++;

    if (element.type === TAG_TYPE) {
      const isTagFilterValid = createTagForm(tagCatalog, element).hierarchyValid;
      if (!isTagFilterValid) {
        return false;
      }

      if (!isTagSiblingsValid(previousElement, nextElement)) {
        return false;
      }
    } else if (element.type === OPEN_BRACKET_TYPE) {
      numberOfOpenedBrackets++;

      if (!isOpenBracketSiblingsValid(previousElement, nextElement)) {
        return false;
      }
    } else if (element.type === CLOSE_BRACKET_TYPE) {
      numberOfOpenedBrackets--;

      if (numberOfOpenedBrackets < 0) {
        return false;
      }

      if (!isCloseBracketSiblingsValid(previousElement, nextElement)) {
        return false;
      }
    } else if (element.type === CONJUNCTION_TYPE) {
      if (isNot(element)) {
        if (!isNotSiblingsValid(previousElement, nextElement)) {
          return false;
        }
      } else if (isAndOr(element)) {
        if (!isAndOrSiblingsValid(previousElement, nextElement)) {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  return numberOfOpenedBrackets === 0;
}

function isTagSiblingsValid(previous, next) {
  const previousValid = !previous || isOpenBracket(previous) || isAndOr(previous) || isNot(previous);
  const nextValid = !next || isAndOr(next) || isCloseBracket(next);
  return previousValid && nextValid;
}

function isOpenBracketSiblingsValid(previous, next) {
  const previousValid = !previous || isOpenBracket(previous) || isAndOr(previous) || isNot(previous);
  const nextValid = next && (isNot(next) || isOpenBracket(next) || isTag(next));
  return previousValid && nextValid;
}

function isCloseBracketSiblingsValid(previous, next) {
  const previousValid = previous && (isCloseBracket(previous) || isTag(previous));
  const nextValid = !next || isCloseBracket(next) || isAndOr(next);
  return previousValid && nextValid;
}

function isAndOrSiblingsValid(previous, next) {
  const previousValid = previous && (isCloseBracket(previous) || isTag(previous));
  const nextValid = next && (isOpenBracket(next) || isTag(next) || isNot(next));
  return previousValid && nextValid;
}

function isNotSiblingsValid(previous, next) {
  const previousValid = !previous || isAndOr(previous) || isOpenBracket(previous);
  const nextValid = next && (isOpenBracket(next) || isTag(next));
  return previousValid && nextValid;
}

function isOpenBracket(element) {
  return element.type === OPEN_BRACKET_TYPE;
}

function isCloseBracket(element) {
  return element.type === CLOSE_BRACKET_TYPE;
}

function isTag(element) {
  return element.type === TAG_TYPE;
}

function isAndOr(element) {
  return (
    element.type === CONJUNCTION_TYPE &&
    (element.logicalOperator === OPERATOR_OR || element.logicalOperator === OPERATOR_AND)
  );
}

function isNot(element) {
  return element.type === CONJUNCTION_TYPE && element.logicalOperator === OPERATOR_NOT;
}
