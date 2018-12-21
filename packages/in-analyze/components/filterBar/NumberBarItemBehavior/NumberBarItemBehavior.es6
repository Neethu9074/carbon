import React from 'react';

import NumberBarOverlayBehavior from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarOverlayBehavior';
import { getNumberTagFilters } from 'in-analyze/components/filterBar/NumberBarItemBehavior/util';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';
import { identity } from 'in-services/util/function';

export default function NumberBarItemBehavior(props) {
  return (
    <Overlay withoutWrapper content={NumberBarOverlayBehavior} props={props}>
      {Content}
    </Overlay>
  );
}

function Content(props) {
  const { singularLabel, toggle, isOpen, refSetter, formatter = identity } = props;
  const { gt, lt, neq, eq } = getNumberTagFilters(props);

  let label = singularLabel;
  if (lt || gt) {
    if (lt) {
      label = `${label} < ${formatter(lt.numberValue || lt.value)}`;
    }
    if (gt) {
      label = `${formatter(gt.numberValue || gt.value)} < ${label}`;
    }
  } else if (eq) {
    label = `${label} = ${formatter(eq.numberValue || eq.value)}`;
  } else if (neq) {
    label = `${label} ≠ ${formatter(neq.numberValue || neq.value)}`;
  }

  return (
    <BarItem
      showArrow
      isOpen={isOpen}
      active={isOpen || eq || neq || lt || gt}
      onClick={toggle}
      refSetter={refSetter}
      withoutTextTransform={!!formatter}
    >
      {label}
    </BarItem>
  );
}
