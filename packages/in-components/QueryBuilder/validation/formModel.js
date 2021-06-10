/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  isPreviousOpenBracketSiblingValid,
  isNextOpenBracketSiblingValid,
  isPreviousCloseBracketSiblingValid,
  isNextCloseBracketSiblingValid
} from 'in-components/QueryBuilder/validation/bracket';
import {
  TAG as TAG_TYPE,
  OPEN_BRACKET as OPEN_BRACKET_TYPE,
  CLOSE_BRACKET as CLOSE_BRACKET_TYPE,
  CONJUNCTION as CONJUNCTION_TYPE
} from 'in-components/QueryBuilder/transformation/formModel';
import {
  isPreviousAndOrSiblingValid,
  isNextAndOrSiblingValid,
  isPreviousNotSiblingValid,
  isNextNotSiblingValid
} from 'in-components/QueryBuilder/validation/conjunction';
import {
  createTagForm,
  isPreviousTagSiblingValid,
  isNextTagSiblingValid
} from 'in-components/QueryBuilder/validation/tagForm';
import {
  getMaximumExpressionDepth,
  toBackendQueryModel
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { isAndOr, isNot } from 'in-components/QueryBuilder/validation/elementIdentificationHelpers';
import { emptyArray } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export function validateFormModel({ tagCatalog, formModel, maxExpressionDepth }) {
  if (!isFormModelSyntacticallyValid({ tagCatalog, formModel })) {
    return { isValid: false, errors: emptyArray };
  }
  if (maxExpressionDepth > 0 && getMaximumExpressionDepth(toBackendQueryModel(formModel)) > maxExpressionDepth) {
    return {
      isValid: false,
      errors: [t('in-components:queryBuilder.errorWithDataYourDefinedQueryIsTooComplex')]
    };
  }

  return { isValid: true };
}

function isFormModelSyntacticallyValid({ tagCatalog, formModel }) {
  if (!(formModel instanceof Array) || !tagCatalog) {
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
  return isPreviousTagSiblingValid(previous) && isNextTagSiblingValid(next);
}

function isOpenBracketSiblingsValid(previous, next) {
  return isPreviousOpenBracketSiblingValid(previous) && isNextOpenBracketSiblingValid(next);
}

function isCloseBracketSiblingsValid(previous, next) {
  return isPreviousCloseBracketSiblingValid(previous) && isNextCloseBracketSiblingValid(next);
}

function isAndOrSiblingsValid(previous, next) {
  return isPreviousAndOrSiblingValid(previous) && isNextAndOrSiblingValid(next);
}

function isNotSiblingsValid(previous, next) {
  return isPreviousNotSiblingValid(previous) && isNextNotSiblingValid(next);
}
