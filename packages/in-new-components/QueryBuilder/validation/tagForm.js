import { createMapForm, createField } from 'formalistic';

import {
  stringValidator,
  jsonPrimitiveValidator,
  booleanValidator,
  numberValidator
} from 'in-services/validators/jsonType';
import * as operatorValueRequirement from 'in-new-components/QueryBuilder/tagFilter/operatorValueRequirement';
import * as operatorKeyRequirement from 'in-new-components/QueryBuilder/tagFilter/operatorKeyRequirement';
import * as typeToOperatorsMapping from 'in-new-components/QueryBuilder/tagFilter/typeToOperatorsMapping';
import { stringMaxLengthValidator, notBlankValidator } from 'in-services/validators/string';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import * as entities from 'in-new-components/QueryBuilder/tagFilter/entities';
import { enrichTagCatalog } from 'in-new-components/QueryBuilder/tagCatalog';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { NUMBER, BOOLEAN } from 'in-new-components/QueryBuilder/tagFilter/types';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { buildEnumValidator } from 'in-services/validators/enum';

const allAllowedEntities = Object.values(entities);

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
    form = form.put(
      'key',
      createField({
        value: tagFormModel?.key ?? '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          stringMaxLengthValidator(512)
        )
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
        value: tagFormModel?.entity || allAllowedEntities[0],
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

function identifyFormRequirementsBasedOnPartialInput(tagCatalog, tagName, operator) {
  const result = {
    requiresKey: false,
    // By default we always want to show this, as it is the most common case.
    requiresValue: true,
    valueValidators: [jsonPrimitiveValidator],
    requiresEntity: false,
    operator: operator ?? EQUALS,
    allowedOperators: []
  };

  if (!tagName) {
    return result;
  }

  const tagDefinition = tagCatalog.tagsByName[tagName];
  if (!tagDefinition) {
    return result;
  }

  result.allowedOperators = typeToOperatorsMapping[tagDefinition.type];
  result.requiresEntity = tagDefinition.canApplyToSource || tagDefinition.canApplyToDestination;
  result.operator = operator = operator ?? (result.allowedOperators && result.allowedOperators[0]) ?? EQUALS;

  const combination = `${tagDefinition.type}_${result.operator}`;
  result.requiresKey = operatorKeyRequirement[combination] ?? false;
  result.requiresValue = operatorValueRequirement[combination] ?? true;

  if (tagDefinition.type === NUMBER) {
    result.valueValidators = [notUndefinedValidator, numberValidator];
  } else if (tagDefinition.type === BOOLEAN) {
    result.valueValidators = [notUndefinedValidator, booleanValidator];
  } else {
    result.valueValidators = [notUndefinedValidator, stringValidator, notBlankValidator, stringMaxLengthValidator(512)];
  }

  return result;
}
