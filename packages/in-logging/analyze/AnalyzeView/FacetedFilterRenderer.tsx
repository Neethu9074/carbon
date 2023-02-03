/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

//@ts-expect-error needs TS migration
import FacetedFilterMultiSelect from 'in-components/AnalyzeView/FacetedFilters/FacetedFilterMultiSelect';
import { ua2FacetedSearchFilterAddedTracker, ua2FacetedSearchGroupChangedTracker } from 'in-components/tracker';
import { FacetedSearchItem } from 'in-components/AnalyzeView/StateManagement';

export default function FacetedFilterRenderer(props: FacetedSearchItem) {
  return (
    <FacetedFilterMultiSelect
      {...props}
      openByDefault={false}
      tracker={{
        suggestionClicked: ua2FacetedSearchFilterAddedTracker,
        groupClicked: ua2FacetedSearchGroupChangedTracker
      }}
    />
  );
}
