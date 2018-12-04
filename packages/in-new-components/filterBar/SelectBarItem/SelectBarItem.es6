import { find } from 'lodash';
import React from 'react';

import SelectBarOverlayBehavior from 'in-new-components/filterBar/SelectBarItem/SelectBarOverlayBehavior';
import BarItem from 'in-new-components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';

export default function SelectBarItem(props) {
  return (
    <Overlay withoutWrapper content={SelectBarOverlayBehavior} props={props}>
      {Content}
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
  const existingTagFilter = find(tagFilters, f => f.name === tag);
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
