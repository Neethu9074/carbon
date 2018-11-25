import React from 'react';

import NumberBarOverlayBehavior from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarOverlayBehavior';
import { getNumberTagFilters } from 'in-analyze/components/filterBar/NumberBarItemBehavior/util';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';

export default function NumberBarItemBehavior(props) {
  return (
    <Overlay withoutWrapper content={NumberBarOverlayBehavior} props={props}>
      {Content}
    </Overlay>
  );
}

function Content(props) {
  const { singularLabel, toggle, isOpen, refSetter } = props;
  const { gt, lt, neq, eq } = getNumberTagFilters(props);

  let label = singularLabel;
  if (lt || gt) {
    if (lt) {
      label = `${label} < ${lt.numberValue}`;
    }
    if (gt) {
      label = `${gt.numberValue} < ${label}`;
    }
  } else if (eq) {
    label = `${label} = ${eq.numberValue}`;
  } else if (neq) {
    label = `${label} ≠ ${neq.numberValue}`;
  }

  return (
    <BarItem showArrow isOpen={isOpen} active={isOpen || eq || neq || lt || gt} onClick={toggle} refSetter={refSetter}>
      {label}
    </BarItem>
  );
}
