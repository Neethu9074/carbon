/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import KeyValueBarOverlayBehavior from 'in-analyze/components/filterBar/KeyValueBarItem/KeyValueBarOverlayBehavior';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-components/overlays/Overlay';

export default function KeyValueBarItemBehavior(props) {
  return (
    <Overlay withoutWrapper content={KeyValueBarOverlayBehavior} props={props} align="bottomMiddle">
      {overlayProps => <Content {...props} {...overlayProps} />}
    </Overlay>
  );
}

const Content = forwardRef(function Content(props, ref) {
  const { label, toggle, isOpen, tagFilters, tag } = props;
  const hasFilters = tagFilters.reduce((agg, f) => agg || f.name === tag, false);

  return (
    <BarItem showArrow isOpen={isOpen} active={isOpen || hasFilters} onClick={toggle} ref={ref}>
      {label}
    </BarItem>
  );
});
