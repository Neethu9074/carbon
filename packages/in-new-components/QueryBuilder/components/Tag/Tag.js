/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-disable react/display-name */
import React, { useRef, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';

import {
  changeOperator,
  changeName,
  createTagForm,
  getFormPresentationInformation
} from 'in-new-components/QueryBuilder/validation/tagForm';
import { EQUALS, NOT_EQUAL, NOT_STARTS_WITH, STARTS_WITH } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { KEY_VALUE_PAIR, STRING, STRING_LIST, STRING_SET } from 'in-new-components/QueryBuilder/tagFilter/types';
import { getSuggestionsTagFilterExpression } from 'in-new-components/QueryBuilder/tagFilter/tagSuggestions';
import SimpleValueSelector from 'in-new-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector';
import BooleanSelector from 'in-new-components/QueryBuilder/components/Tag/BooleanSelector';
import { STRING_MAX_LENGTH } from 'in-new-components/QueryBuilder/tagFilter/constraints';
import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';
import NumberInput from 'in-new-components/QueryBuilder/components/Tag/NumberInput';
import Operator from 'in-new-components/QueryBuilder/components/Tag/Operator';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import Entity from 'in-new-components/QueryBuilder/components/Tag/Entity';
import Remove from 'in-new-components/QueryBuilder/components/Tag/Remove';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import Name from 'in-new-components/QueryBuilder/components/Tag/Name';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import useThemedLocals from 'in-hooks/useThemedLocals';
import useTimeConfig from 'in-hooks/useTimeConfig';
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
    formModel,
    autoFocusInput = false
  } = props;
  const { renderModelIndex, formModelIndex } = element;
  const form = createTagForm(tagCatalog, element);
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
        />
      ))}
      <Name
        {...props}
        focus={() => focusField('name', true)}
        ref={autoFocusTargets.name}
        onChange={newTag => {
          if (newTag.type === TAG) {
            const newForm = changeName(tagCatalog, form, newTag.name);
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
          tagType={tagType}
          getSuggestions={getSuggestions}
          formModel={formModel}
          formModelIndex={formModelIndex}
          autoFocus={autoFocusInput}
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
          formModel={formModel}
          formModelIndex={formModelIndex}
          minNumValue={0}
          autoFocus={autoFocusInput && !form.get('key')}
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
          ? t('in-new-components:queryBuilder.sanitizedTagFilterValue')
          : t('in-new-components:queryBuilder.sanitizedTagFilterValueAndOperator');
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

function KeyInput({ form, onChange, tagType, getSuggestions, formModel, formModelIndex, autoFocus }) {
  const timeConfig = useTimeConfig();
  const field = form.get('key');
  if (!field) {
    return null;
  }

  const entity = form.get('entity')?.value;

  return (
    <Input
      value={field.value || ''}
      onChange={value => onChange('key', value)}
      placeholder="Key"
      valid={field.valid}
      hideValidityInformationOnFocus
      fieldsToWatch={[tagType, entity, timeConfig]}
      getSuggestions={() =>
        getSuggestions({
          tagFilterExpression: getSuggestionsTagFilterExpression(formModel, formModelIndex),
          name: form.get('name').value,
          tagName: form.get('name').value,
          entity,
          key: field.value,
          timeConfig,
          propose: 'KEYS'
        })
      }
      autoFocus={autoFocus}
    />
  );
}

function ValueInput({
  valueType,
  form,
  onValueChange,
  getSuggestions,
  focusField,
  booleanSelectorRef,
  formModel,
  formModelIndex,
  minNumValue,
  autoFocus
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
        placeholder="Value"
        onChange={onValueChange}
        minValue={minNumValue}
      />
    );
  }

  const entity = form.get('entity')?.value;
  const key = form.get('key')?.value;

  const inputProps = {
    placeholder: 'Value',
    onChange: onValueChange,
    valid: field.valid,
    fieldsToWatch: [entity, timeConfig, field.value, key],
    getSuggestions: () =>
      getSuggestions({
        tagFilterExpression: getSuggestionsTagFilterExpression(formModel, formModelIndex),
        key,
        value: field.value,
        entity,
        name: form.get('name').value,
        tagName: form.get('name').value,
        timeConfig,
        propose: 'VALUES'
      })
  };

  return <Input type="text" value={field.value || ''} {...inputProps} autoFocus={autoFocus} />;
}

function Input({ value, fieldsToWatch, placeholder, onChange, getSuggestions, valid, autoFocus }) {
  const result = useDebouncedValue(value, onChange, 500);

  return (
    <SimpleValueSelector
      onChange={result.onChange}
      value={result.value}
      close={() => {}}
      getSuggestions={getSuggestions}
      fieldsToWatch={fieldsToWatch}
      inputProps={{
        type: 'text',
        valid,
        placeholder,
        hideValidityInformationOnFocus: true
      }}
      autoFocus={autoFocus}
    />
  );
}
