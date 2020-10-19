import React from 'react';

import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';

import locals from './Suggestion.mless';

export default function FacetedExpandableCard(props) {
  return (
    <ExpandableCard
      useMaxAvailableHeight={false}
      framed={false}
      className={locals.facetedCard}
      headerClassName={locals.facetedCardHeader}
      size="s"
      {...props}
    >
      {props.children}
    </ExpandableCard>
  );
}
