/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find } from 'lodash';
import React from 'react';

import SelectBarOverlayBehavior from 'in-analyze/components/filterBar/SelectBarItem/SelectBarOverlayBehavior';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-components/overlays/Overlay';

export default function SelectBarItem(props) {
  return (
    <Overlay withoutWrapper content={SelectBarOverlayBehavior} props={props}>
      {({ toggle, refSetter, isOpen }) => (
        <Content
          toggle={toggle}
          isOpen={isOpen}
          refSetter={refSetter}
          singularLabel={props.singularLabel}
          tagFilters={props.tagFilters}
          tag={props.tag}
          selectedItemRenderer={props.selectedItemRenderer}
          withoutTextTransform={props.withoutTextTransform}
        />
      )}
    </Overlay>
  );
}

function Content({
  singularLabel,
  toggle,
  isOpen,
  tagFilters,
  tag,
  selectedItemRenderer,
  refSetter,
  withoutTextTransform
}) {
  const existingTagFilter = find(tagFilters, f => f.name === tag && f.operator === 'EQUALS');
  return (
    <BarItem
      showArrow
      withoutTextTransform={withoutTextTransform}
      isOpen={isOpen}
      active={isOpen || existingTagFilter}
      onClick={toggle}
      refSetter={refSetter}
    >
      {existingTagFilter ? renderItem(existingTagFilter, selectedItemRenderer) : singularLabel}
    </BarItem>
  );
}

function renderItem(existingTagFilter, selectedItemRenderer) {
  const label = existingTagFilter.stringValue || existingTagFilter.value;
  return selectedItemRenderer ? selectedItemRenderer(label) : label;
}
