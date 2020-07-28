/* eslint-disable react/display-name */
import React, { useRef, useLayoutEffect, useState } from 'react';

import {
  changeOperator,
  changeName,
  createTagForm,
  getFormPresentationInformation
} from 'in-new-components/QueryBuilder/validation/tagForm';
import SimpleValueSelector from 'in-new-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector';
import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';
import Operator from 'in-new-components/QueryBuilder/components/Tag/Operator';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import Entity from 'in-new-components/QueryBuilder/components/Tag/Entity';
import Remove from 'in-new-components/QueryBuilder/components/Tag/Remove';
import Name from 'in-new-components/QueryBuilder/components/Tag/Name';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './Tag.mless';

export default function Tag(props) {
  const { onChange: onChangeInFormModel, onRemove, dragAndDropProps, tagCatalog, element, getSuggestions } = props;
  const { renderModelIndex, formModelIndex } = element;
  const form = createTagForm(tagCatalog, element);
  const { allowedOperators, valueType, type: tagType } = getFormPresentationInformation(tagCatalog, form);

  // To allow re-rendering when no React state has changed. We use this when we change the
  // postUpdateFocus ref in order to force React to re-execute the hooks. Updating a ref
  // does not cause a re-render hence this workaround.
  const forceRerender = useState()[1];
  const autoFocusTargets = {
    entity: useRef(),
    name: useRef(),
    operator: useRef()
  };
  const postUpdateFocus = useRef();
  useLayoutEffect(() => {
    autoFocusTargets[postUpdateFocus.current?.target]?.current?.focus();
  }, [postUpdateFocus.current?.id]);

  return (
    <div
      className={locals.tag}
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

      <KeyInput form={form} onChange={onChange} tagType={tagType} getSuggestions={getSuggestions} />

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

      <ValueInput
        valueType={valueType}
        form={form}
        onChange={onChange}
        tagType={tagType}
        getSuggestions={getSuggestions}
      />

      <Remove element={element} onRemove={onRemove} />
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

function KeyInput({ form, onChange, tagType, getSuggestions }) {
  const entity = form.get('entity')?.value;
  const timeConfig = useTimeConfig();

  return form.get('key')?.map(field => (
    <Input
      value={field.value || ''}
      onChange={value => onChange('key', value)}
      placeholder="Key"
      valid={field.valid}
      fieldsToWatch={[tagType, entity, timeConfig]}
      getSuggestions={() =>
        getSuggestions({
          // TODO: tagFilterExpression,
          name: tagType,
          entity,
          timeConfig,
          propose: 'KEYS'
        })
      }
    />
  ));
}

function ValueInput({ valueType, form, onChange, tagType, getSuggestions }) {
  const field = form.get('value');
  if (!field) {
    return null;
  }

  if (valueType === Boolean) {
    return <span className={locals.booleanPlaceholder}>true</span>;
  }

  const entity = form.get('entity')?.value;
  const key = form.get('key')?.value;
  const timeConfig = useTimeConfig();

  const inputProps = {
    placeholder: 'Value',
    onChange: value => onChange('value', value),
    valid: field.valid,
    fieldsToWatch: [entity, timeConfig, field.value, key],
    getSuggestions: () =>
      getSuggestions({
        // TODO: tagFilterExpression,
        key,
        value: field.value || valueType === Number ? 0 : '',
        entity,
        name: tagType,
        timeConfig,
        propose: 'VALUES'
      })
  };

  if (valueType === Number) {
    return <Input type="number" value={field.value || 0} {...inputProps} />;
  }
  return <Input type="text" value={field.value || ''} {...inputProps} />;
}

function Input({ value, type, fieldsToWatch, placeholder, onChange, getSuggestions, valid }) {
  const result = useDebouncedValue(value, onChange, 500);

  return (
    <SimpleValueSelector
      onChange={result.onChange}
      close={() => {}}
      getSuggestions={getSuggestions}
      fieldsToWatch={fieldsToWatch}
      inputProps={{
        type,
        valid,
        placeholder
      }}
    />
  );
}
