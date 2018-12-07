import React from 'react';

import NumberBarOverlayBehavior from 'in-new-components/filterBar/NumberBarItemBehavior/NumberBarOverlayBehavior';
import { getNumberTagFilters } from 'in-new-components/filterBar/NumberBarItemBehavior/util';
import BarItem from 'in-new-components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';

export default function NumberBarItemBehavior(props) {
  return (
    <Overlay withoutWrapper content={NumberBarOverlayBehavior} props={props}>
      {Content}
    </Overlay>
  );
}

function Content(props) {
  const { singularLabel, unit, toggle, isOpen, refSetter } = props;
  const { gt, lt, neq, eq } = getNumberTagFilters(props);

  let label = singularLabel;
  if (lt || gt) {
    if (lt) {
      label = `${label} < ${lt.numberValue || lt.value}${renderUnit(unit)}`;
    }
    if (gt) {
      label = `${gt.numberValue || gt.value}${renderUnit(unit)} < ${label}`;
    }
  } else if (eq) {
    label = `${label} = ${eq.numberValue || eq.value}${renderUnit(unit)}`;
  } else if (neq) {
    label = `${label} ≠ ${neq.numberValue || neq.value}${renderUnit(unit)}`;
  }

  return (
    <BarItem
      showArrow
      isOpen={isOpen}
      active={isOpen || eq || neq || lt || gt}
      onClick={toggle}
      refSetter={refSetter}
      withoutTextTransform={!!unit}
    >
      {label}
    </BarItem>
  );
}

function renderUnit(unit) {
  return unit ? ' ' + unit : '';
}
