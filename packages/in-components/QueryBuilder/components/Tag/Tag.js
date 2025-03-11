/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/* eslint-disable react/display-name */
import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import {
  changeName,
  changeOperator,
  createTagForm,
  getFormPresentationInformation
} from 'in-components/QueryBuilder/validation/tagForm';
// eslint-disable-next-line import/no-unresolved
import BooleanSelector from 'in-components/QueryBuilder/components/Tag/BooleanSelector';
import { EQUALS, NOT_EQUAL, NOT_STARTS_WITH, STARTS_WITH } from 'in-components/QueryBuilder/tagFilter/operators';
import { KEY_VALUE_PAIR, STRING, STRING_LIST, STRING_SET } from 'in-components/QueryBuilder/tagFilter/types';
import { getSuggestionsTagFilterExpression } from 'in-components/QueryBuilder/tagFilter/tagSuggestions';
import { STRING_MAX_LENGTH } from 'in-components/QueryBuilder/tagFilter/constraints';
import NumberInput from 'in-components/QueryBuilder/components/Tag/NumberInput';
import { onElementKeyUp } from 'in-components/QueryBuilder/keyboardInteraction';
import Operator from 'in-components/QueryBuilder/components/Tag/Operator';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { Input } from 'in-components/QueryBuilder/components/Tag/Input';
import Entity from 'in-components/QueryBuilder/components/Tag/Entity';
import Remove from 'in-components/QueryBuilder/components/Tag/Remove';
import Name from 'in-components/QueryBuilder/components/Tag/Name';
import useThemedLocals from 'in-hooks/useThemedLocals';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

import styleDefs from './Tag.mless';

export default function Tag(props) {
  const {
    onChange: onChangeInFormModel,
    onRemove,
    dragAndDropProps,
    tagCatalog,
    element,
    getSuggestions,
    getSuggestionsProps,
    formModel,
    autoFocusInput = false,
    getSuggestionLabel,
    allowEmptyKey,
    disableEntitySelection
  } = props;
  const { renderModelIndex, formModelIndex, name: tagName } = element;
  const form = createTagForm(tagCatalog, element, allowEmptyKey, disableEntitySelection);
  const { allowedOperators, valueType, type: tagType } = getFormPresentationInformation(tagCatalog, form);
  const locals = useThemedLocals(styleDefs);

  // To allow re-rendering when no React state has changed. We use this when we change the
  // postUpdateFocus ref in order to force React to re-execute the hooks. Updating a ref
  // does not cause a re-render hence this workaround.
  const forceRerender = useState()[1];
  const autoFocusTargets = {
    entity: useRef(),
    name: useRef(),
    operator: useRef(),
    booleanSelector: useRef()
  };
  const postUpdateFocus = useRef();
  useLayoutEffect(() => {
    autoFocusTargets[postUpdateFocus.current?.target]?.current?.focus();
    // We manually control repaints on ref changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postUpdateFocus.current?.id]);

  const draggableElement = useRef(null);

  const tagTreeNode = tagCatalog.tagsByName[tagName];
  return (
    <div
      ref={draggableElement}
      className={classNames({
        [locals.tag]: true,
        [locals.invalid]: !form.hierarchyValid
      })}
      tabIndex={0}
      data-render-model-index={renderModelIndex}
      data-query-builder-element="true"
      onKeyUp={event => onElementKeyUp({ event, renderModelIndex, formModelIndex, onRemove })}
      {...dragAndDropProps}
    >
      {form.get('entity')?.map(field => (
        <Entity
          focus={() => focusField('entity', true)}
          ref={autoFocusTargets.entity}
          entity={field.value}
          renderModelIndex={renderModelIndex}
          onChange={entity => {
            focusField('entity', false);
            onChange('entity', entity);
          }}
          sourceEnabled={tagTreeNode?.canApplyToSource}
          destinationEnabled={tagTreeNode?.canApplyToDestination}
        />
      ))}
      <Name
        {...props}
        focus={() => focusField('name', true)}
        ref={autoFocusTargets.name}
        onChange={newTag => {
          if (newTag.type === TAG) {
            const newForm = changeName(tagCatalog, form, newTag.name, newTag.tagDefinition);
            focusField('name', false);
            onChangeInFormModel(newForm.toJS(), false);
          } else {
            onChangeInFormModel(newTag, true);
          }
        }}
      />
      <SuspendDraggable draggableElement={draggableElement}>
        <KeyInput
          form={form}
          onChange={onChange}
          getSuggestions={getSuggestions}
          getSuggestionsProps={getSuggestionsProps}
          formModel={formModel}
          formModelIndex={formModelIndex}
          autoFocus={autoFocusInput}
          getSuggestionLabel={getSuggestionLabel}
        />
      </SuspendDraggable>
      <Operator
        element={element}
        allowedOperators={allowedOperators}
        onChange={_operator => {
          const newForm = changeOperator(tagCatalog, form, _operator);
          focusField('operator', false);
          onChangeInFormModel(newForm.toJS(), false);
        }}
        tagType={tagType}
        focus={() => focusField('operator', true)}
        ref={autoFocusTargets.operator}
      />
      <SuspendDraggable draggableElement={draggableElement}>
        <ValueInput
          valueType={valueType}
          form={form}
          onValueChange={onValueChange}
          tagType={tagType}
          focusField={focusField}
          booleanSelectorRef={autoFocusTargets.booleanSelector}
          renderModelIndex={renderModelIndex}
          getSuggestions={getSuggestions}
          getSuggestionsProps={getSuggestionsProps}
          formModel={formModel}
          formModelIndex={formModelIndex}
          minNumValue={0}
          autoFocus={autoFocusInput && !form.get('key')}
          getSuggestionLabel={getSuggestionLabel}
        />
      </SuspendDraggable>
      <RemoveIcon form={form} element={element} tagType={tagType} onRemove={onRemove} />
    </div>
  );

  function focusField(name, executeForcedRerender = false) {
    postUpdateFocus.current = {
      id: Date.now(),
      target: name
    };

    if (executeForcedRerender) {
      forceRerender(Date.now());
    }
  }

  function onValueChange(value) {
    const stringValueMaxLengthExceeded =
      (tagType === STRING || tagType === STRING_SET || tagType === STRING_LIST || tagType === KEY_VALUE_PAIR) &&
      value?.length > STRING_MAX_LENGTH;
    if (stringValueMaxLengthExceeded) {
      // shorten the value and change the operator if needed
      let operator = form.items.operator.value;
      if (operator === EQUALS) {
        operator = STARTS_WITH;
      } else if (operator === NOT_EQUAL) {
        operator = NOT_STARTS_WITH;
      }
      const message =
        operator === form.items.operator.value
          ? t('in-components:queryBuilder.sanitizedTagFilterValue')
          : t('in-components:queryBuilder.sanitizedTagFilterValueAndOperator');
      onChangeInFormModel(
        {
          ...form.toJS(),
          value: value.substring(0, STRING_MAX_LENGTH),
          operator
        },
        // keep focus
        false
      );
      addMessage(
        {
          type: 'info',
          timeout: 5000,
          content: message
        },
        'sanitizedTagFilter'
      );
    } else {
      onChange('value', value);
    }
  }

  function onChange(propName, value) {
    onChangeInFormModel(
      {
        ...form.toJS(),
        [propName]: value
      },

      // keep focus
      false
    );
  }
}

function SuspendDraggable({ draggableElement, children }) {
  return (
    <div
      onMouseEnter={() => draggableElement.current.setAttribute('draggable', 'false')}
      onMouseLeave={() => draggableElement.current.setAttribute('draggable', 'true')}
    >
      {children}
    </div>
  );
}

function RemoveIcon({ form, element, tagType, onRemove }) {
  const field = form.get('value');
  if (!field || (field && tagType !== 'BOOLEAN')) {
    return <Remove element={element} onRemove={onRemove} />;
  }

  return <Remove element={element} onRemove={onRemove} nextToBooleanSelector />;
}

function KeyInput({
  form,
  onChange,
  getSuggestions,
  getSuggestionsProps,
  formModel,
  formModelIndex,
  autoFocus,
  getSuggestionLabel
}) {
  const timeConfig = useTimeConfig();
  const field = form.get('key');
  if (!field) {
    return null;
  }

  const entity = form.get('entity')?.value;
  const name = form.get('name')?.value;
  const availability = form.get('tagDefinition')?.value?.availability;

  return (
    <Input
      value={field.value || ''}
      onChange={value => onChange('key', value)}
      placeholder={t('in-components:queryBuilder.components.tagPlaceholderKey')}
      valid={field.valid}
      hideValidityInformationOnFocus
      fieldsToWatch={[name, entity, timeConfig, field.value, formModel, formModelIndex, getSuggestionsProps]}
      getSuggestions={() =>
        getSuggestions({
          tagFilterExpression: getSuggestionsTagFilterExpression(formModel, formModelIndex),
          name: name,
          tagName: name,
          entity,
          key: field.value,
          timeConfig,
          propose: 'KEYS',
          availability,
          ...getSuggestionsProps
        })
      }
      autoFocus={autoFocus}
      getSuggestionLabel={getSuggestionLabel}
    />
  );
}

function ValueInput({
  valueType,
  form,
  onValueChange,
  getSuggestions,
  getSuggestionsProps,
  focusField,
  booleanSelectorRef,
  formModel,
  formModelIndex,
  minNumValue,
  autoFocus,
  getSuggestionLabel
}) {
  const timeConfig = useTimeConfig();
  const field = form.get('value');
  if (!field) {
    return null;
  }

  if (valueType === Boolean) {
    return (
      <BooleanSelector
        onChange={value => {
          focusField('booleanSelector', false);
          onValueChange(value === 'true');
        }}
        focus={() => focusField('booleanSelector', true)}
        value={field.value}
        ref={booleanSelectorRef}
      />
    );
  }

  if (valueType === Number) {
    return (
      <NumberInput
        value={field.value}
        valid={field.valid}
        placeholder={t('in-components:queryBuilder.components.tagPlaceholderValue')}
        onChange={onValueChange}
        minValue={minNumValue}
      />
    );
  }

  const entity = form.get('entity')?.value;
  const key = form.get('key')?.value;
  const name = form.get('name')?.value;
  const availability = form.get('tagDefinition')?.value?.availability;

  const inputProps = {
    placeholder: t('in-components:queryBuilder.components.tagPlaceholderValue'),
    onChange: onValueChange,
    valid: isBlank(key) || field.valid, // only validate value field after key is filled
    fieldsToWatch: [name, entity, timeConfig, field.value, key, formModel, formModelIndex, getSuggestionsProps],
    tagName: name,
    getSuggestions: () =>
      getSuggestions({
        tagFilterExpression: getSuggestionsTagFilterExpression(formModel, formModelIndex),
        key,
        value: field.value,
        entity,
        name: name,
        tagName: name,
        timeConfig,
        propose: 'VALUES',
        availability,
        ...getSuggestionsProps
      })
  };
  return (
    <Input
      type="text"
      value={field.value || ''}
      {...inputProps}
      autoFocus={autoFocus}
      getSuggestionLabel={getSuggestionLabel}
    />
  );
}
