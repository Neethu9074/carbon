/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find } from 'lodash';
import React from 'react';

import CheckboxBarItemBehavior from 'in-analyze/components/filterBar/CheckboxBarItem/CheckboxBarItemBehavior';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';
import { operators } from 'in-analyze/applicationFilter';

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
    f => f.name === tag.synthetic && f.operator === operators.EQUALS && f.value === 'true'
  );
  const existingInternalFilter = find(
    tagFilters,
    f => f.name === tag.internal && f.operator === operators.EQUALS && f.value === 'true'
  );

  return (
    <BarItem
      showArrow
      withoutTextTransform={withoutTextTransform}
      isOpen={isOpen}
      active={isOpen || existingSyntheticFilter || existingInternalFilter}
      onClick={toggle}
      refSetter={refSetter}
    >
      {singularLabel}
    </BarItem>
  );
}
