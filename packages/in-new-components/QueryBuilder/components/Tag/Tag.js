/* eslint-disable react/display-name */
import React, { useRef, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';

import {
  changeOperator,
  changeName,
  createTagForm,
  getFormPresentationInformation
} from 'in-new-components/QueryBuilder/validation/tagForm';
import { getSuggestionsTagFilterExpression } from 'in-new-components/QueryBuilder/tagFilter/tagSuggestions';
import SimpleValueSelector from 'in-new-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector';
import BooleanSelector from 'in-new-components/QueryBuilder/components/Tag/BooleanSelector';
import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';
import NumberInput from 'in-new-components/QueryBuilder/components/Tag/NumberInput';
import Operator from 'in-new-components/QueryBuilder/components/Tag/Operator';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import Entity from 'in-new-components/QueryBuilder/components/Tag/Entity';
import Remove from 'in-new-components/QueryBuilder/components/Tag/Remove';
import Name from 'in-new-components/QueryBuilder/components/Tag/Name';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import useThemedLocals from 'in-hooks/useThemedLocals';
import useTimeConfig from 'in-hooks/useTimeConfig';

import styleDefs from './Tag.mless';

export default function Tag(props) {
  const {
    onChange: onChangeInFormModel,
    onRemove,
    dragAndDropProps,
    tagCatalog,
    element,
    getSuggestions,
    formModel
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
  }, [postUpdateFocus.current?.id]);

  return (
    <div
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

      <KeyInput
        form={form}
        onChange={onChange}
        tagType={tagType}
        getSuggestions={getSuggestions}
        formModel={formModel}
        formModelIndex={formModelIndex}
      />

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
        focusField={focusField}
        booleanSelectorRef={autoFocusTargets.booleanSelector}
        renderModelIndex={renderModelIndex}
        getSuggestions={getSuggestions}
        formModel={formModel}
        formModelIndex={formModelIndex}
        // temporarily restrict the latency min value to 1, should be removed for UA2 GA
        minNumValue={element.name === 'call.latency' || element.name === 'trace.latency' ? 1 : 0}
      />

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

function RemoveIcon({ form, element, tagType, onRemove }) {
  const field = form.get('value');
  if (!field || (field && tagType !== 'BOOLEAN')) {
    return <Remove element={element} onRemove={onRemove} />;
  }

  return <Remove element={element} onRemove={onRemove} nextToBooleanSelector />;
}

function KeyInput({ form, onChange, tagType, getSuggestions, formModel, formModelIndex }) {
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
    />
  );
}

function ValueInput({
  valueType,
  form,
  onChange,
  getSuggestions,
  focusField,
  booleanSelectorRef,
  formModel,
  formModelIndex,
  minNumValue
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
          onChange('value', value === 'true');
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
        onChange={value => onChange('value', value)}
        minValue={minNumValue}
      />
    );
  }

  const entity = form.get('entity')?.value;
  const key = form.get('key')?.value;

  const inputProps = {
    placeholder: 'Value',
    onChange: value => onChange('value', value),
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

  return <Input type="text" value={field.value || ''} {...inputProps} />;
}

function Input({ value, fieldsToWatch, placeholder, onChange, getSuggestions, valid }) {
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
    />
  );
}
