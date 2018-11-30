import React from 'react';

import KeyValueBarOverlayBehavior from 'in-new-components/filterBar/KeyValueBarItem/KeyValueBarOverlayBehavior';
import BarItem from 'in-new-components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';

export default function KeyValueBarItemBehavior(props) {
  return (
    <Overlay withoutWrapper content={KeyValueBarOverlayBehavior} props={props}>
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
