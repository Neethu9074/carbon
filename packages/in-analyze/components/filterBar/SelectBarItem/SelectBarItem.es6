import { find } from 'lodash';
import React from 'react';

import SelectBarOverlayBehavior from 'in-analyze/components/filterBar/SelectBarItem/SelectBarOverlayBehavior';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';

export default function SelectBarItemBehavior(props) {
  return (
    <Overlay withoutWrapper content={SelectBarOverlayBehavior} props={props}>
      {Content}
    </Overlay>
  );
}

function Content({ singularLabel, toggle, isOpen, tagFilters, tag, refSetter }) {
  const existingTagFilter = find(tagFilters, f => f.name === tag);
  return (
    <BarItem showArrow isOpen={isOpen} active={isOpen || existingTagFilter} onClick={toggle} refSetter={refSetter}>
      {existingTagFilter ? existingTagFilter.stringValue : singularLabel}
    </BarItem>
  );
}
