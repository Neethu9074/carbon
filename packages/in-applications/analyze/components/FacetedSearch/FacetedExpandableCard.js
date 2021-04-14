/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ua2FacetedSearchFilterOpenedTracker, ua2FacetedSearchFilterClosedTracker } from 'in-applications/tracker';
import ExpandableCard from 'in-new-components/ExpandableCard/ExpandableCard';
import { openFacetedSearchByDefault } from 'in-services/featureFlags';

import locals from './Suggestion.mless';

export default function FacetedExpandableCard(props) {
  return (
    <ExpandableCard
      useMaxAvailableHeight={false}
      framed={false}
      className={locals.facetedCard}
      headerClassName={locals.facetedCardHeader}
      size="s"
      tooltipDisabled
      expansionTracker={({ expanded }) => {
        const tracker = expanded ? ua2FacetedSearchFilterOpenedTracker : ua2FacetedSearchFilterClosedTracker;
        tracker({
          tag: props.tag,
          dataSource: props.dataSource
        });
      }}
      {...props}
      openByDefault={props.openByDefault || openFacetedSearchByDefault}
    >
      <div className={locals.facetedCardBody}>{props.children}</div>
    </ExpandableCard>
  );
}
