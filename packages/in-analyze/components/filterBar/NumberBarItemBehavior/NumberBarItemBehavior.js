/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import NumberBarOverlayBehavior from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarOverlayBehavior';
import { getNumberTagFilters, showGt, showLt } from 'in-analyze/components/filterBar/NumberBarItemBehavior/util';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-components/overlays/Overlay';
import { identity } from 'in-services/util/function';

export default function NumberBarItemBehavior(props) {
  return (
    <Overlay withoutWrapper content={NumberBarOverlayBehavior} props={props}>
      {Content}
    </Overlay>
  );
}

function Content(props) {
  const { singularLabel, toggle, isOpen, refSetter, formatter = identity, minValue } = props;
  const { gt, gte, lt, lte, neq, eq } = getNumberTagFilters(props);

  let label = singularLabel;
  if (lt || lte || gt || gte) {
    if (showLt(lt?.value, lte?.value)) {
      label = `${label} < ${formatter(lt.numberValue || lt.value)}`;
    } else if (lte) {
      label = `${label} <= ${formatter(lte.numberValue || lte.value)}`;
    }
    if (showGt(gt?.value, gte?.value)) {
      label = `${formatter(gt.numberValue || gt.value)} < ${label}`;
    } else if (gte) {
      label = `${formatter(gte.numberValue || gte.value)} <= ${label}`;
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
      minValue={minValue}
    >
      {label}
    </BarItem>
  );
}
