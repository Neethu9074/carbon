/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import KeyValueBarOverlayBehavior from 'in-analyze/components/filterBar/KeyValueBarItem/KeyValueBarOverlayBehavior';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';

export default function KeyValueBarItemBehavior(props) {
  return (
    <Overlay withoutWrapper content={KeyValueBarOverlayBehavior} props={props} align="bottomMiddle">
      {Content}
    </Overlay>
  );
}

function Content(props) {
  const { label, toggle, isOpen, refSetter, tagFilters, tag } = props;
  const hasFilters = tagFilters.reduce((agg, f) => agg || f.name === tag, false);

  return (
    <BarItem showArrow isOpen={isOpen} active={isOpen || hasFilters} onClick={toggle} refSetter={refSetter}>
      {label}
    </BarItem>
  );
}
