/* eslint-disable react/display-name */
import AutosizeInput from 'react-input-autosize';
import React from 'react';

import SourceDestinationSelectorOverlay from 'in-new-components/QueryBuilder/SourceDestinationSelectorOverlay/SourceDestinationSelectorOverlay';
import OperatorSelectorOverlay from 'in-new-components/QueryBuilder/OperatorSelectorOverlay/OperatorSelectorOverlay';
import { getFormPresentationInformation, createTagForm } from 'in-new-components/QueryBuilder/validation/tagForm';
import * as operatorLabels from 'in-new-components/QueryBuilder/tagFilter/operatorLabelsMapping';
import { SOURCE, DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import { onElementKeyUp } from 'in-new-components/QueryBuilder/keyboardInteraction';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';

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
      <TagName tagTreeNode={tagTreeNode} name={element.name} />
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
      <RemoveIcon element={element} onRemove={onRemove} />
    </div>
  );

  function onChange(propName, value) {
    onChangeInFormModel(
      {
        ...form.toJS(),
        [propName]: value
      },
      false
    ); // false: keep focus
  }
}

function EntityIcon({ tagTreeNode }) {
  if (!tagTreeNode) {
    return null;
  }

  let icon = tagTreeNode.icon;
  for (let i = tagTreeNode.path.length - 1; i > 0; i--) {
    const node = tagTreeNode.path[i];
    icon = node.icon;
    if (icon) {
      break;
    }
  }
  return icon ? <SvgIcon className={locals.entityIcon} type={icon} /> : null;
}

function Entity({ entity, onChange, renderModelIndex }) {
  if (entity === SOURCE || entity === DESTINATION) {
    return (
      <Overlay
        withoutWrapper
        align="bottomMiddle"
        content={SourceDestinationSelectorOverlay}
        props={{ value: entity, onChange }}
        onCloseSideEffect={e => {
          // Ensure the element retains its focus when closing the overlay with the escape key.
          if (e instanceof KeyboardEvent) {
            focus(renderModelIndex);
          }
        }}
      >
        {({ toggle, refSetter }) => (
          <SvgIcon
            className={locals.sourceIcon}
            type={entity === SOURCE ? 'lib_application_call_source' : 'lib_application_call_destination'}
            refSetter={refSetter}
            onClick={toggle}
          />
        )}
      </Overlay>
    );
  }
  return null;
}

function RemoveIcon({ element, onRemove }) {
  return (
    <SvgIcon
      className={locals.icon}
      type="lib_openclose_cancel"
      tabIndex={-1}
      onClick={() => onRemove(element.formModelIndex, element.renderModelIndex - 1)}
    />
  );
}

function TagName({ tagTreeNode, name }) {
  const path = tagTreeNode?.path;
  if (path) {
    return (
      <span className={locals.tagName}>
        {path
          .slice(0, path.length - 1)
          .map(node => node.label)
          .join(' ')}
        <SvgIcon className={locals.tagIcon} type="lib_arrow_expand_right" />
        {path[path.length - 1].label}
      </span>
    );
  }
  return <span className={locals.tagName}>{name}</span>;
}

function Operator({ operator, allowedOperators, tagType, renderModelIndex, onChange }) {
  return (
    <Overlay
      withoutWrapper
      align="bottomMiddle"
      content={OperatorSelectorOverlay}
      props={{ value: operator, onChange, allowedOperators, tagType }}
      onCloseSideEffect={e => {
        // Ensure the element retains its focus when closing the overlay with the escape key.
        if (e instanceof KeyboardEvent) {
          focus(renderModelIndex);
        }
      }}
    >
      {({ toggle, refSetter }) => (
        <span className={locals.operator} onClick={toggle} ref={refSetter}>
          {operatorLabels[`${tagType}_${operator}`]}
        </span>
      )}
    </Overlay>
  );
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
