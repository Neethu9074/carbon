/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  OPERATOR_AND,
  OPERATOR_NOT,
  OPERATOR_OR,
  toBackendQueryModel
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { CLOSE_BRACKET, CONJUNCTION, OPEN_BRACKET, TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { isUnaryOperator } from 'in-components/QueryBuilder/tagFilter/operators';

/**
 * Creates a tagFilterExpression to query the tag suggestions API endpoint.
 * Depending on the tag in the query and the context of the surrounding query, certain suggestions should be filtered out since they make no logical sense.
 * Therefore, steps are taken to define a tagFilterExpression (see https://www.notion.so/instana/OR-operator-ec13bec4d66d48249a176a65c8459fb3#8879c6e2d1994ebe95fb3a0783e00da9).
 * @param {object} formModel The complete, current form model, as displayed in the UI.
 * @param {int} formModelIndex The index of the tag that suggestions are to be queried for.
 */
export function getSuggestionsTagFilterExpression(formModel, formModelIndex) {
  // If the current tag is the only tag in the query, no filtering has to be done.
  if (formModel.length === 1) {
    return toBackendQueryModel([]);
  }

  const filterFormModel = [];

  //Recurses in both directions, to find which tags have to be added to the filter.
  evaluateNextElement(formModel, formModelIndex, -1, filterFormModel);
  evaluateNextElement(formModel, formModelIndex, 1, filterFormModel);

  //Filter form model is cleaned and converted to be used by the backend.
  const nonEmptyFilterFormModel = removeEmptyFormModelElements(filterFormModel);
  return toBackendQueryModel(nonEmptyFilterFormModel);
}

/**
 * Recursive function to go through a form model, removing empty elements, i.e., tag filters with
 * missing values, which are considered invalid.
 * Finds the first element to be empty, removes it (and potentially one operator), and tries again.
 * Returns a clean model if no empty elements are found.
 * @param {object} formModel The form model to be cleaned from empty elements.
 */
function removeEmptyFormModelElements(formModel) {
  const emptyElementIndex = formModel.findIndex(
    element =>
      element.type === TAG && !isUnaryOperator(element.operator) && (hasMissingValue(element) || hasEmptyKey(element))
  );
  if (emptyElementIndex === -1) {
    return formModel;
  } else {
    const newModel = checkAndRemoveEmptyElement(formModel, emptyElementIndex);
    return removeEmptyFormModelElements(newModel);
  }
}

function hasMissingValue(element) {
  return !('value' in element) || element.value === '' || element.value == null;
}

function hasEmptyKey(element) {
  return 'key' in element && element.key === '';
}

/**
 * Removes a (tag) element from the form model.
 * Checks if elements to the left and right exists.
 * If they do not, the element is removed on its own.
 * If there are is only one element to the left or to the right, it is removed with the element if it is a conjuction.
 * If both elements exist, it is checked if they are conjuctions.
 * If none are, the element is removed on its own.
 * If one is, it is removed with the element.
 * If both are, it is checked if one is a logical AND, which is removed with the element.
 * If none are, the right element is removed with the indexed element.
 * @param {object} formModel The form model to remove a defined element from.
 * @param {*} index The index of the to-be-removed element.
 */
function checkAndRemoveEmptyElement(formModel, index) {
  var leftElement, rightElement;
  if (index - 1 > 0) {
    leftElement = formModel[index - 1];
  }
  if (index + 1 <= formModel.length) {
    rightElement = formModel[index + 1];
  }
  if (leftElement === undefined && rightElement === undefined) {
    formModel.splice(index, 1);
  }
  if (leftElement !== undefined && rightElement === undefined) {
    if (leftElement.type === CONJUNCTION) {
      formModel.splice(index - 1, 2);
    } else {
      formModel.splice(index, 1);
    }
  }
  if (leftElement === undefined && rightElement !== undefined) {
    if (rightElement.type === CONJUNCTION) {
      formModel.splice(index, 2);
    } else {
      formModel.splice(index, 1);
    }
  }
  if (leftElement !== undefined && rightElement !== undefined) {
    if (leftElement.type !== CONJUNCTION && rightElement.type !== CONJUNCTION) {
      formModel.splice(index, 1);
    }
    if (leftElement.type === CONJUNCTION && rightElement.type !== CONJUNCTION) {
      formModel.splice(index - 1, 2);
    }
    if (leftElement.type !== CONJUNCTION && rightElement.type === CONJUNCTION) {
      formModel.splice(index, 2);
    }
    if (leftElement.type === CONJUNCTION && rightElement.type === CONJUNCTION) {
      if (leftElement.logicalOperator === OPERATOR_AND && rightElement.logicalOperator !== OPERATOR_AND) {
        formModel.splice(index - 1, 2);
      }
      formModel.splice(index - 1, 2);
    }
  }
  return formModel;
}

/**
 * Recursive function to iterate through the query in one direction from a starting index.
 * The index next to the current index is retrieved (depending on the direction).
 * If the next index is out of bounds, the function terminates.
 * If the next element is invalid in the query, the function terminates.
 * If the next element is a closing bracket (depending on the direction), it is skipped, and the next element is evaluated recursively.
 * If the next element is a logical AND, it is checked if the conjuncted element exists and is valid, otherwise the function terminates.
 * If it is valid, it is added to the filter if it is a tag, or it is evaluated and added if it is a bracket expression.
 * If the next element is a logical OR, it is checked if the conjuncted element exists and is valid, otherwise the function terminates.
 * If it is valid, elements and bracket expressions are skipped until a new enclosing bracket is encountered, then the recursion is set to continue at that bracket.
 * @param {object} formModel The complete, current form model, as displayed in the UI.
 * @param {*} index The current index the recursion is placed at (usually a tag or a bracket, if the query is valid).
 * @param {*} directionalModifier The modifier to move the recursion left or right. Should either be -1 or 1.
 * @param {object} filterFormModel The filter form model to be populated.
 */
function evaluateNextElement(formModel, index, directionalModifier, filterFormModel) {
  const nextElementIndex = index + directionalModifier;

  //Checks if the next element exists, if not, the left/right end of the query was reached.
  if (!checkIndexWithinBounds(formModel, nextElementIndex)) {
    return;
  }

  const nextElement = formModel[nextElementIndex];

  //Checks if the next element is invalid (an open bracket, another tag, or NOT, which is currently not supported)
  //Checks for open brackets (depending on direction, ")" for left, "(" for right).
  if (isOpenBracketInDirection(nextElement, directionalModifier)) {
    return;
  }
  //Checks for other tag
  if (nextElement.type === TAG) {
    return;
  }
  //Checks for possible NOT (currently not supported)
  if (nextElement.type === CONJUNCTION && nextElement.logicalOperator === OPERATOR_NOT) {
    return;
  }

  //Skips enclosing bracket (depending on direction, "(" for left, ")" for right).
  if (isCloseBracketInDirection(nextElement, directionalModifier)) {
    evaluateNextElement(formModel, nextElementIndex, directionalModifier, filterFormModel);
    return;
  }

  //Evaluates AND expression by adding tag or bracket expression to filter model.
  if (nextElement.type === CONJUNCTION && nextElement.logicalOperator === OPERATOR_AND) {
    const conjunctedElementIndex = nextElementIndex + directionalModifier;

    //Checks if conjuncted element exists.
    if (!checkIndexWithinBounds(formModel, conjunctedElementIndex)) {
      return;
    }

    const conjunctedElement = formModel[conjunctedElementIndex];

    //Checks if the conjuncted element is invalid (a closing bracket or another conjunction).
    //Checks for closing brackets (depending on direction, "(" for left, ")" for right).
    if (isCloseBracketInDirection(conjunctedElement, directionalModifier)) {
      return;
    }
    //Checks for another conjunction.
    if (conjunctedElement.type === CONJUNCTION) {
      return;
    }

    //Checks if the conjuncted element is a tag.
    if (conjunctedElement.type === TAG) {
      addToFilterFormModel(filterFormModel, [conjunctedElement]);
      evaluateNextElement(formModel, conjunctedElementIndex, directionalModifier, filterFormModel);
      return;
    }

    //Checks if the conjuncted element is the beginning of a bracket expression
    if (isOpenBracketInDirection(conjunctedElement, directionalModifier)) {
      const { terminatingBracketIndex, missingBrackets, valid } = evaluateNextBracketElement(
        formModel,
        conjunctedElementIndex,
        directionalModifier,
        0
      );
      if (valid) {
        //If the bracket expression is valid, it is added to the filter.
        //If brackets are missing to terminate the expression at the end of the query, they are added at the beginning or end, depending on direction.
        const bracketStartIndex = Math.min(conjunctedElementIndex, terminatingBracketIndex);
        const bracketEndIndex = Math.max(conjunctedElementIndex, terminatingBracketIndex);
        const isGoingRight = bracketStartIndex === conjunctedElementIndex;
        const bracketExpression = [];
        if (!isGoingRight) {
          for (let bracketLeft = 0; bracketLeft < missingBrackets; bracketLeft++) {
            bracketExpression.push({
              type: OPEN_BRACKET
            });
          }
        }
        for (let i = bracketStartIndex; i <= bracketEndIndex; i++) {
          bracketExpression.push(formModel[i]);
        }
        if (isGoingRight) {
          for (let bracketRight = 0; bracketRight < missingBrackets; bracketRight++) {
            bracketExpression.push({
              type: CLOSE_BRACKET
            });
          }
        }
        addToFilterFormModel(filterFormModel, bracketExpression);
        //The recursion is continued after the bracket expression.
        evaluateNextElement(formModel, terminatingBracketIndex, directionalModifier, filterFormModel);
      }
      return;
    }
  }

  //Evaluates OR expression by skipping until the end or until an enclosing bracket is reached.
  if (nextElement.type === CONJUNCTION && nextElement.logicalOperator === OPERATOR_OR) {
    const conjunctedElementIndex = nextElementIndex + directionalModifier;

    //Checks if conjuncted element exists.
    if (!checkIndexWithinBounds(formModel, conjunctedElementIndex)) {
      return;
    }

    const conjunctedElement = formModel[conjunctedElementIndex];

    //Checks if the conjuncted element is invalid (a closing bracket or another conjunction).
    //Checks for closing brackets (depending on direction, "(" for left, ")" for right).
    if (isCloseBracketInDirection(conjunctedElement, directionalModifier)) {
      return;
    }
    //Checks for another conjunction.
    if (conjunctedElement.type === CONJUNCTION) {
      return;
    }

    //Checks if the conjuncted element is a tag.
    if (conjunctedElement.type === TAG) {
      //The recursion is continued after a new enclosing bracket following the tag.
      const nextEvaluableIndex = skipOrBasedElement(formModel, conjunctedElementIndex, directionalModifier, 0);
      evaluateNextElement(formModel, nextEvaluableIndex, directionalModifier, filterFormModel);
      return;
    }

    //Checks if the conjuncted element is the beginning of a bracket expression
    if (isOpenBracketInDirection(conjunctedElement, directionalModifier)) {
      const { terminatingBracketIndex, missingBrackets, valid } = evaluateNextBracketElement(
        formModel,
        conjunctedElementIndex,
        directionalModifier,
        0
      );
      if (valid) {
        //If there are missing brackets, the bracket expression is reaching the end of the query, recursion can therefore be terminated.
        if (missingBrackets > 0) {
          return;
        }
        //The recursion is continued after a new enclosing bracket following the bracket expression.
        const nextEvaluableIndex = skipOrBasedElement(formModel, terminatingBracketIndex, directionalModifier, 0);
        evaluateNextElement(formModel, nextEvaluableIndex, directionalModifier, filterFormModel);
      }
      return;
    }
  }

  //Default panic return, should not be reachable.
  //Left in in case of breaking changes to have clean recursion exits.
  return;
}

/**
 * Checks if a given index is a valid index (in-bounds) in a given form model.
 * @param {object} formModel The complete, current form model, as displayed in the UI.
 * @param {int} index The index to be checked to be in-bounds.
 */
function checkIndexWithinBounds(formModel, index) {
  return index >= 0 && index < formModel.length;
}

/**
 * Checks whether a given element contains an open bracket in the direction of recursion.
 * Returns true if the given element is a ")" when going left or if it is a "(" going right.
 * @param {object} element The element to be evaluated as a bracket.
 * @param {int} directionalModifier The modifier to check left or right. Should either be -1 or 1.
 */
function isOpenBracketInDirection(element, directionalModifier) {
  return (
    (directionalModifier < 0 && element.type === CLOSE_BRACKET) ||
    (directionalModifier > 0 && element.type === OPEN_BRACKET)
  );
}

/**
 * Checks whether a given element contains a close bracket in the direction of recursion.
 * Returns true if the given element is a "(" when going left or if it is a ")" going right.
 * @param {object} element The element to be evaluated as a bracket.
 * @param {int} directionalModifier The modifier to check left or right. Should either be -1 or 1.
 */
function isCloseBracketInDirection(element, directionalModifier) {
  return (
    (directionalModifier < 0 && element.type === OPEN_BRACKET) ||
    (directionalModifier > 0 && element.type === CLOSE_BRACKET)
  );
}

/**
 * Recurses through a bracket expression in the query form model.
 * Returns the index of the other "side" of the bracket expression,
 * the number of missing brackets if the recursion has successfully hit the end of the query,
 * and if the bracket expression is valid at all.
 * @param {*} formModel The complete, current form model, as displayed in the UI.
 * @param {*} index The index to check from in this recursion. Initially, this should be an opening bracket, depending on the direction.
 * @param {*} directionalModifier The modifier to check left or right. Should either be -1 or 1.
 * @param {*} bracketLevel The level of sub-bracket expression the recursion resides in. Initially, this should be 0.
 */
function evaluateNextBracketElement(formModel, index, directionalModifier, bracketLevel) {
  const nextElementIndex = index + directionalModifier;

  const currentElement = formModel[index];
  const nextElement = formModel[nextElementIndex];

  //Checks if the next element exists, if not, the left/right end of the query was reached.
  if (!checkIndexWithinBounds(formModel, nextElementIndex)) {
    //If no next index exists, the end was reached before the bracket was terminated. More brackets can then be added.
    const terminatingEnd = directionalModifier > 0 ? formModel.length - 1 : 0;
    return {
      terminatingBracketIndex: terminatingEnd,
      missingBrackets: bracketLevel + 1,
      // Only report the subexpression valid if it does not end with a trailing conjunction
      // Ending at a conjunction would mean we've evaluated a subexpression like e.g. "(TAG CONJUNCTION"
      // Reporting this subexpression as valid would automatically add a missing closing parenthesis to the subexpression
      // and add it to the filtered formModel
      // Passing this invalid filtered formModel to `toBackendQueryModel` will crash with an unexpected token as it is
      // an invalid formModel and `toBackendQueryModel` only expects valid ones by design
      valid: currentElement.type !== CONJUNCTION && !(nextElementIndex < 0 && currentElement.type === CLOSE_BRACKET)
    };
  }

  // Checks if the next element is the closing bracket and the current one is no conjunction
  // Having a closing bracket following a conjunction would be invalid
  if (
    currentElement.type !== CONJUNCTION &&
    isCloseBracketInDirection(nextElement, directionalModifier) &&
    bracketLevel === 0
  ) {
    return {
      terminatingBracketIndex: nextElementIndex,
      missingBrackets: 0,
      valid: true
    };
  }

  //Depending on the current element, different elements are possible.
  if (isCloseBracketInDirection(currentElement, directionalModifier) || currentElement.type === TAG) {
    //If the current element is a tag or a closing bracket, the next element has to be a conjunction or a closing bracket.
    const nextIsCloseBracket = isCloseBracketInDirection(nextElement, directionalModifier);
    if (nextIsCloseBracket || nextElement.type === CONJUNCTION) {
      return nextIsCloseBracket
        ? evaluateNextBracketElement(formModel, nextElementIndex, directionalModifier, bracketLevel - 1)
        : evaluateNextBracketElement(formModel, nextElementIndex, directionalModifier, bracketLevel);
    } else {
      return {
        terminatingBracketIndex: 0,
        missingBrackets: 0,
        valid: false
      };
    }
  } else {
    //If the current element is an open bracket or a conjunction, the next element has to be a tag or an open bracket.
    const nextIsOpenBracket = isOpenBracketInDirection(nextElement, directionalModifier);
    if (nextIsOpenBracket || nextElement.type === TAG) {
      return nextIsOpenBracket
        ? evaluateNextBracketElement(formModel, nextElementIndex, directionalModifier, bracketLevel + 1)
        : evaluateNextBracketElement(formModel, nextElementIndex, directionalModifier, bracketLevel);
    } else {
      return {
        terminatingBracketIndex: 0,
        missingBrackets: 0,
        valid: false
      };
    }
  }
}

/**
 * Recurses through the query until a new enclosing bracket (depending on the direction) is found.
 * All elements following an OR operator are irrelevant to the logical expression until elevated to a higher context,
 * as in, outside of a bracket expression the OR resides in.
 * Therefore, all elements can be ignored until the end or an enclosing bracket is hit
 * @param {object} formModel The complete, current form model, as displayed in the UI.
 * @param {*} index The index to check from in this recursion. Initially, this should be an element following an OR operator.
 * @param {*} directionalModifier The modifier to check left or right. Should either be -1 or 1.
 * @param {*} bracketLevel The level of sub-bracket expression the recursion resides in. Initially, this should be 0.
 */
function skipOrBasedElement(formModel, index, directionalModifier, bracketLevel) {
  const nextElementIndex = index + directionalModifier;

  //Checks if the next element exists, if not, the left/right end of the query was reached.
  if (!checkIndexWithinBounds(formModel, nextElementIndex)) {
    return nextElementIndex;
  }

  const nextElement = formModel[nextElementIndex];

  //Checks if the element is a closing bracket.
  if (isCloseBracketInDirection(nextElement, directionalModifier)) {
    //Checks if the bracket is part of the same context or a new enclosing bracket.
    return bracketLevel === 0
      ? nextElementIndex
      : skipOrBasedElement(formModel, nextElementIndex, directionalModifier, bracketLevel - 1);
  }

  //Checks if a new open bracket takes the expression to a lower context, and recurses in the given bracket level.
  return isOpenBracketInDirection(nextElement, directionalModifier)
    ? skipOrBasedElement(formModel, nextElementIndex, directionalModifier, bracketLevel + 1)
    : skipOrBasedElement(formModel, nextElementIndex, directionalModifier, bracketLevel);
}

/**
 * Pushes form model elements to the model of filtered elements.
 * If there are already existing elements, the elements are conjuncted using a logical AND.
 * @param {object} filterFormModel The filter form model to be populated.
 * @param {array} elements The form model elements to be added to the filter model.
 */
function addToFilterFormModel(filterFormModel, elements) {
  if (filterFormModel.length > 0) {
    filterFormModel.push({
      type: CONJUNCTION,
      logicalOperator: OPERATOR_AND
    });
  }
  filterFormModel.push(...elements);
}
