/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createMapForm, createField } from 'formalistic';

import {
  stringValidator,
  jsonPrimitiveValidator,
  booleanValidator,
  numberValidator
} from 'in-services/validators/jsonType';
import {
  isOpenBracket,
  isCloseBracket,
  isAndOr,
  isNot
} from 'in-new-components/QueryBuilder/validation/elementIdentificationHelpers';
import * as operatorValueRequirement from 'in-new-components/QueryBuilder/tagFilter/operatorValueRequirement';
import * as operatorKeyRequirement from 'in-new-components/QueryBuilder/tagFilter/operatorKeyRequirement';
import * as typeToOperatorsMapping from 'in-new-components/QueryBuilder/tagFilter/typeToOperatorsMapping';
import { EQUALS, NOT_EMPTY, IS_EMPTY } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { stringMaxLengthValidator, notBlankValidator } from 'in-services/validators/string';
import { SOURCE, DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { NUMBER, BOOLEAN } from 'in-new-components/QueryBuilder/tagFilter/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { buildEnumValidator } from 'in-services/validators/enum';
import { enrichTagCatalog } from 'in-services/tags/tagCatalog';

const allAllowedEntities = [SOURCE, DESTINATION];
const defaultEntity = DESTINATION;

export function createTagForm(tagCatalog, tagFormModel) {
  tagCatalog = enrichTagCatalog(tagCatalog);

  const {
    requiresKey,
    requiresValue,
    valueValidators,
    requiresEntity,
    allowedOperators,
    operator
  } = identifyFormRequirementsBasedOnPartialInput(tagCatalog, tagFormModel?.name, tagFormModel?.operator);

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
          buildEnumValidator(tagCatalog.allTagNames)
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
    );

  if (requiresKey) {
    // Special case: For IS_EMPTY, NOT_EMPTY the key is actually optional
    let validator;
    if (operator === IS_EMPTY || operator === NOT_EMPTY) {
      validator = composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, stringMaxLengthValidator(512));
    } else {
      validator = composeAndShortCircuitOnError(
        notUndefinedValidator,
        stringValidator,
        notBlankValidator,
        stringMaxLengthValidator(512)
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

  if (requiresEntity) {
    form = form.put(
      'entity',
      createField({
        value: tagFormModel?.entity || defaultEntity,
        validator: composeAndShortCircuitOnError(stringValidator, buildEnumValidator(allAllowedEntities))
      })
    );
  }

  // Variation to the most common form behavior: We always want to see error immediately!
  return form.setTouched(true, { recurse: true });
}

// Changes the tag name and updates the form state accordingly
export function changeName(tagCatalog, formalisticTagForm, newName) {
  tagCatalog = enrichTagCatalog(tagCatalog);

  const tagForm = formalisticTagForm.toJS();
  const previousName = tagForm.name;
  tagForm.name = newName;

  const previousTagDefinition = tagCatalog.tagsByName[previousName];
  const tagDefinition = tagCatalog.tagsByName[newName];
  if (tagDefinition) {
    const supportsConfiguredOperator = typeToOperatorsMapping[tagDefinition.type].indexOf(tagForm.operator) >= 0;
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
  } else {
    // Clear both previously set values. This is an abnormal code path. Under
    // normal circumstances we should be able to identify the tag definition.
    tagForm.operator = undefined;
    tagForm.value = undefined;
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
    formalisticTagForm.get('operator').value
  );
  // Reduce the number of exposed fields.
  return { allowedOperators, valueType, type };
}

function identifyFormRequirementsBasedOnPartialInput(tagCatalog, tagName, operator) {
  const result = {
    type: null,
    requiresKey: false,
    // By default we always want to show this, as it is the most common case.
    requiresValue: true,
    valueValidators: [jsonPrimitiveValidator],
    requiresEntity: false,
    operator: operator ?? EQUALS,
    allowedOperators: [],
    // To allow the form to decide whether to use a String, Boolean or Number input
    valueType: String
  };

  if (!tagName) {
    return result;
  }

  const tagDefinition = tagCatalog.tagsByName[tagName];
  if (!tagDefinition) {
    return result;
  }

  result.type = tagDefinition.type;
  result.allowedOperators = typeToOperatorsMapping[tagDefinition.type];
  result.requiresEntity = tagDefinition.canApplyToSource || tagDefinition.canApplyToDestination;
  result.operator = operator = operator ?? (result.allowedOperators && result.allowedOperators[0]) ?? EQUALS;

  const combination = `${tagDefinition.type}_${result.operator}`;
  result.requiresKey = operatorKeyRequirement[combination] ?? false;
  result.requiresValue = operatorValueRequirement[combination] ?? true;

  if (tagDefinition.type === NUMBER) {
    result.valueValidators = [notUndefinedValidator, numberValidator];
    result.valueType = Number;
  } else if (tagDefinition.type === BOOLEAN) {
    result.valueValidators = [notUndefinedValidator, booleanValidator];
    result.valueType = Boolean;
  } else {
    result.valueValidators = [notUndefinedValidator, stringValidator, notBlankValidator, stringMaxLengthValidator(512)];
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
