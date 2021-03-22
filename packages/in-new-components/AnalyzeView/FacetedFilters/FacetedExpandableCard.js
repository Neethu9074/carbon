/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';

import locals from './FacetedExpandableCard.mless';

export default function FacetedExpandableCard(props) {
  return (
    <ExpandableCard
      useMaxAvailableHeight={false}
      framed={false}
      className={locals.facetedCard}
      headerClassName={locals.facetedCardHeader}
      size="s"
      tooltipDisabled
      {...props}
    >
      <div className={locals.facetedCardBody}>{props.children}</div>
    </ExpandableCard>
  );
}
