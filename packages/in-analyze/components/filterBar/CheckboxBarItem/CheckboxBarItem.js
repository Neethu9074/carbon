import { find } from 'lodash';
import React from 'react';

import CheckboxBarItemBehavior from 'in-analyze/components/filterBar/CheckboxBarItem/CheckboxBarItemBehavior';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';

export default function CheckboxBarItem(props) {
  return (
    <Overlay withoutWrapper content={CheckboxBarItemBehavior} props={props}>
      {Content}
    </Overlay>
  );
}

function Content({ singularLabel, toggle, isOpen, refSetter, withoutTextTransform, tagFilters, tag }) {
  const existingSyntheticFilter = find(
    tagFilters,
    f => f.name === tag.synthetic && f.operator === 'EQUALS' && f.value === 'true'
  );
  const existingHiddenFilter = find(
    tagFilters,
    f => f.name === tag.hidden && f.operator === 'EQUALS' && f.value === 'true'
  );

  return (
    <BarItem
      showArrow
      withoutTextTransform={withoutTextTransform}
      isOpen={isOpen}
      active={isOpen || existingSyntheticFilter || existingHiddenFilter}
      onClick={toggle}
      refSetter={refSetter}
    >
      {singularLabel}
    </BarItem>
  );
}
