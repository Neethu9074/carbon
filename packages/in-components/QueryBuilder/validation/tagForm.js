/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';

import {
  stringValidator,
  jsonPrimitiveValidator,
  booleanValidator,
  numberValidator,
  objectValidator
} from 'in-services/validators/jsonType';
import {
  isOpenBracket,
  isCloseBracket,
  isAndOr,
  isNot
} from 'in-components/QueryBuilder/validation/elementIdentificationHelpers';
import * as operatorValueRequirement from 'in-components/QueryBuilder/tagFilter/operatorValueRequirement';
import * as operatorKeyRequirement from 'in-components/QueryBuilder/tagFilter/operatorKeyRequirement';
import { getAllowedOperators } from 'in-components/QueryBuilder/tagFilter/typeToOperatorsMapping';
import { EQUALS, NOT_EMPTY, IS_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import { stringMaxLengthValidator, notBlankValidator } from 'in-services/validators/string';
import { STRING_MAX_LENGTH } from 'in-components/QueryBuilder/tagFilter/constraints';
import { SOURCE, DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { NUMBER, BOOLEAN } from 'in-components/QueryBuilder/tagFilter/types';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { buildEnumValidator } from 'in-services/validators/enum';
import { enrichTagCatalog } from 'in-services/tags/tagCatalog';

const allAllowedEntities = [SOURCE, DESTINATION];

export function createTagForm(tagCatalog, tagFormModel, allowEmptyKey = false, disableEntitySelection = false) {
  tagCatalog = enrichTagCatalog(tagCatalog);

  const {
    requiresKey,
    requiresValue,
    valueValidators,
    requiresEntity,
    allowedOperators,
    allowedTagNames,
    operator,
    canApplyToDestination,
    tagDefinition
  } = identifyFormRequirementsBasedOnPartialInput(
    tagCatalog,
    tagFormModel?.name,
    tagFormModel?.operator,
    tagFormModel?.tagDefinition
  );

  let form = createMapForm()
    // type field is not actually editable. We only expose it so that the caller can call toJS() on the
    // formalistic form to generate a valid form model tag filter element.
    .put(
      'type',
      createField({
        value: TAG,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator([TAG])
        )
      })
    )
    .put(
      'name',
      createField({
        value: tagFormModel?.name ?? '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(allowedTagNames)
        )
      })
    )
    .put(
      'operator',
      createField({
        value: operator,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(allowedOperators)
        )
      })
    )
    .put(
      'tagDefinition',
      createField({
        value: minimizeTagDefinition(tagDefinition),
        validator: composeAndShortCircuitOnError(objectValidator)
      })
    );

  if (requiresKey) {
    // Special case: For IS_EMPTY, NOT_EMPTY the key is actually optional
    let validator;
    if (operator === IS_EMPTY || operator === NOT_EMPTY || allowEmptyKey) {
      validator = composeAndShortCircuitOnError(
        notUndefinedValidator,
        stringValidator,
        stringMaxLengthValidator(STRING_MAX_LENGTH)
      );
    } else {
      validator = composeAndShortCircuitOnError(
        notUndefinedValidator,
        stringValidator,
        notBlankValidator,
        stringMaxLengthValidator(STRING_MAX_LENGTH)
      );
    }

    form = form.put(
      'key',
      createField({
        value: tagFormModel?.key ?? '',
        validator
      })
    );
  }

  if (requiresValue) {
    form = form.put(
      'value',
      createField({
        value: tagFormModel?.value,
        validator: composeAndShortCircuitOnError(...valueValidators)
      })
    );
  }

  if (!disableEntitySelection && requiresEntity) {
    form = form.put(
      'entity',
      createField({
        value: tagFormModel?.entity || (canApplyToDestination ? DESTINATION : SOURCE),
        validator: composeAndShortCircuitOnError(stringValidator, buildEnumValidator(allAllowedEntities))
      })
    );
  }

  // Variation to the most common form behavior: We always want to see error immediately!
  return form.setTouched(true, { recurse: true });
}

// Changes the tag name and updates the form state accordingly
export function changeName(tagCatalog, previousTagForm, newName, incomingTagDefinition) {
  tagCatalog = enrichTagCatalog(tagCatalog);

  const tagForm = previousTagForm.toJS();
  const previousName = tagForm.name;
  tagForm.name = newName;

  const previousTagDefinition = previousTagForm.tagDefinition ?? tagCatalog.tagsByName[previousName];
  const tagDefinition = incomingTagDefinition ?? tagCatalog.tagsByName[newName];
  if (tagDefinition) {
    const supportsConfiguredOperator =
      getAllowedOperators(tagDefinition, tagCatalog.source).indexOf(tagForm.operator) >= 0;
    if (!supportsConfiguredOperator) {
      tagForm.operator = undefined;
    }

    if (previousTagDefinition?.type !== tagDefinition.type) {
      tagForm.value = undefined;
    }

    // boolean values get a default selection due to the dropdown
    if (tagDefinition.type === 'BOOLEAN') {
      tagForm.value = true;
    }

    tagForm.tagDefinition = minimizeTagDefinition(incomingTagDefinition);
  } else {
    // Clear both previously set values. This is an abnormal code path. Under
    // normal circumstances we should be able to identify the tag definition.
    tagForm.operator = undefined;
    tagForm.value = undefined;
    tagForm.tagDefinition = undefined;
  }

  return createTagForm(tagCatalog, tagForm);
}

// Changes the tag operator and updates the form state accordingly
export function changeOperator(tagCatalog, formalisticTagForm, newOperator) {
  const tagForm = formalisticTagForm.toJS();
  tagForm.operator = newOperator;
  return createTagForm(tagCatalog, tagForm);
}

export function getFormPresentationInformation(tagCatalog, formalisticTagForm) {
  const { allowedOperators, valueType, type } = identifyFormRequirementsBasedOnPartialInput(
    tagCatalog,
    formalisticTagForm.get('name').value,
    formalisticTagForm.get('operator').value,
    formalisticTagForm.get('tagDefinition').value
  );
  // Reduce the number of exposed fields.
  return { allowedOperators, valueType, type };
}

export function minimizeTagDefinition(tagDefinition) {
  if (!tagDefinition) {
    return undefined;
  }

  const { name, path, type, availability } = tagDefinition;

  return {
    name,
    type,
    path: path?.map(({ label }) => ({ label })),
    availability
  };
}

function identifyFormRequirementsBasedOnPartialInput(tagCatalog, tagName, operator, incomingTagDefinition) {
  const result = {
    type: null,
    requiresKey: false,
    // By default we always want to show this, as it is the most common case.
    requiresValue: true,
    valueValidators: [jsonPrimitiveValidator],
    requiresEntity: false,
    operator: operator ?? EQUALS,
    allowedOperators: [],
    allowedTagNames: [],
    // To allow the form to decide whether to use a String, Boolean or Number input
    valueType: String
  };

  if (!tagName) {
    return result;
  }

  const tagDefinition = incomingTagDefinition ?? tagCatalog.tagsByName[tagName];

  if (!tagDefinition) {
    return result;
  }

  result.tagDefinition = incomingTagDefinition;
  result.type = tagDefinition.type;
  result.allowedOperators = getAllowedOperators(tagDefinition, tagCatalog.source);
  result.allowedTagNames = [tagDefinition.name, ...(tagDefinition.aliases ?? [])];
  result.requiresEntity = tagDefinition.canApplyToSource || tagDefinition.canApplyToDestination;
  result.canApplyToDestination = tagDefinition.canApplyToDestination;
  result.operator = operator = operator ?? (result.allowedOperators && result.allowedOperators[0]) ?? EQUALS;

  const combination = `${tagDefinition.type}_${result.operator}`;
  result.requiresKey = operatorKeyRequirement[combination] ?? false;
  result.requiresValue = operatorValueRequirement[combination] ?? true;

  if (
    tagDefinition.type === NUMBER ||
    tagDefinition.type === 'KEY_NUMBER_PAIR' ||
    tagDefinition.type === 'FLOAT_LIST'
  ) {
    result.valueValidators = [notUndefinedValidator, numberValidator];
    result.valueType = Number;
  } else if (tagDefinition.type === BOOLEAN) {
    result.valueValidators = [notUndefinedValidator, booleanValidator];
    result.valueType = Boolean;
  } else {
    result.valueValidators = [
      notUndefinedValidator,
      stringValidator,
      notBlankValidator,
      stringMaxLengthValidator(STRING_MAX_LENGTH)
    ];
    result.valueType = String;
  }

  return result;
}

export function isPreviousTagSiblingValid(previous) {
  return !previous || isOpenBracket(previous) || isAndOr(previous) || isNot(previous);
}

export function isNextTagSiblingValid(next) {
  return !next || isAndOr(next) || isCloseBracket(next);
}
