/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { find } from 'lodash';
import React from 'react';

import MultiSelectBarOverlayBehavior from 'in-analyze/components/filterBar/MultiSelectBarItem/MultiSelectBarOverlayBehavior';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';

export default function MultiSelectBarItem(props) {
  return (
    <Overlay withoutWrapper content={MultiSelectBarOverlayBehavior} props={props}>
      {Content}
    </Overlay>
  );
}

function Content({ pluralLabel, toggle, isOpen, tagFilters, tag, refSetter, withoutTextTransform }) {
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
      {pluralLabel}
    </BarItem>
  );
}
