/* eslint-disable react/display-name */
import React, { useRef, useLayoutEffect, useState } from 'react';
import AutosizeInput from 'react-input-autosize';

import {
  changeOperator,
  changeName,
  createTagForm,
  getFormPresentationInformation
} from 'in-new-components/QueryBuilder/validation/tagForm';
import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';
import Operator from 'in-new-components/QueryBuilder/components/Tag/Operator';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import Entity from 'in-new-components/QueryBuilder/components/Tag/Entity';
import Remove from 'in-new-components/QueryBuilder/components/Tag/Remove';
import Name from 'in-new-components/QueryBuilder/components/Tag/Name';
import { evaluateClassNames } from 'in-services/util/classnames';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import Tooltip from 'in-components/Tooltip';

import locals from './Tag.mless';

export default function Tag(props) {
  const { onChange: onChangeInFormModel, onRemove, dragAndDropProps, tagCatalog, element } = props;
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
      {form.get('key')?.map(field => (
        <Input
          value={field.value || ''}
          properyName="value"
          onChange={value => onChange('key', value)}
          valid={field.valid}
          messages={field.messages}
        />
      ))}
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
      {form.get('value')?.map(field => (
        <>
          {valueType === Boolean && <span className={locals.booleanPlaceholder}>true</span>}
          {valueType === Number && (
            <Input
              type="number"
              value={field.value || 0}
              properyName="valueAsNumber"
              onChange={value => onChange('value', value)}
              valid={field.valid}
              messages={field.messages}
            />
          )}
          {valueType === String && (
            <Input
              type="text"
              value={field.value || ''}
              properyName="value"
              onChange={value => onChange('value', value)}
              valid={field.valid}
              messages={field.messages}
            />
          )}
        </>
      ))}
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

function Input({ value, type, properyName, onChange, valid, messages }) {
  const result = useDebouncedValue(value, onChange, 500);

  return (
    <Tooltip themeStyle="light" content={messages && messages.length > 0 ? messages[0].message : undefined}>
      <AutosizeInput
        inputClassName={evaluateClassNames({
          [locals.input]: true,
          [locals.invalid]: !valid
        })}
        type={type}
        minWidth={32}
        value={result.value}
        onChange={e => result.onChange(e.target[properyName])}
      />
    </Tooltip>
  );
}
