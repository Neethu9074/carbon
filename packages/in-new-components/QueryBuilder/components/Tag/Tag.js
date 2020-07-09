/* eslint-disable react/display-name */
import AutosizeInput from 'react-input-autosize';
import React from 'react';

import { getFormPresentationInformation, createTagForm } from 'in-new-components/QueryBuilder/validation/tagForm';
import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';
import EntityIcon from 'in-new-components/QueryBuilder/components/Tag/EntityIcon';
import Operator from 'in-new-components/QueryBuilder/components/Tag/Operator';
import Entity from 'in-new-components/QueryBuilder/components/Tag/Entity';
import Remove from 'in-new-components/QueryBuilder/components/Tag/Remove';
import Name from 'in-new-components/QueryBuilder/components/Tag/Name';
import useDebouncedValue from 'in-hooks/useDebouncedValue';

import locals from './Tag.mless';

export default function Tag(props) {
  const { onChange: onChangeInFormModel, onRemove, dragAndDropProps, tagCatalog, element } = props;
  const { renderModelIndex, formModelIndex } = element;
  const form = createTagForm(tagCatalog, element);
  const { allowedOperators, valueType, type: tagType } = getFormPresentationInformation(tagCatalog, form);
  const tagTreeNode = tagCatalog.tagsByName[element.name];

  return (
    <div
      className={locals.tag}
      tabIndex={0}
      data-render-model-index={renderModelIndex}
      data-query-builder-element="true"
      onKeyUp={event => onElementKeyUp({ event, renderModelIndex, formModelIndex, onRemove })}
      {...dragAndDropProps}
    >
      <EntityIcon tagTreeNode={tagTreeNode} />
      {form
        .get('entity')
        ?.map(field => (
          <Entity
            entity={field.value}
            renderModelIndex={renderModelIndex}
            onChange={entity => onChange('entity', entity)}
          />
        ))}
      <Name tagTreeNode={tagTreeNode} name={element.name} />
      {form
        .get('key')
        ?.map(field => <Input value={field.value} properyName="value" onChange={value => onChange('key', value)} />)}
      <Operator
        operator={element.operator}
        allowedOperators={allowedOperators}
        tagType={tagType}
        onChange={_operator => onChange('operator', _operator)}
      />
      {form.get('value')?.map(field => (
        <>
          {valueType === Boolean && <div />}
          {valueType === Number && (
            <Input
              type="number"
              value={field.value}
              properyName="valueAsNumber"
              onChange={value => onChange('value', value)}
            />
          )}
          {valueType === String && (
            <Input type="text" value={field.value} properyName="value" onChange={value => onChange('value', value)} />
          )}
        </>
      ))}
      <Remove element={element} onRemove={onRemove} />
    </div>
  );

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

function Input({ value, type, properyName, onChange }) {
  const result = useDebouncedValue(value, onChange, 500);

  return (
    <AutosizeInput
      inputClassName={locals.input}
      type={type}
      value={result.value}
      minWidth={32}
      onChange={e => result.onChange(e.target[properyName])}
    />
  );
}
