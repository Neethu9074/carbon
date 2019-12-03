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

function Content({ singularLabel, toggle, isOpen, refSetter, withoutTextTransform }) {
  return (
    <BarItem
      showArrow
      withoutTextTransform={withoutTextTransform}
      isOpen={isOpen}
      active={isOpen}
      onClick={toggle}
      refSetter={refSetter}
    >
      {singularLabel}
    </BarItem>
  );
}
