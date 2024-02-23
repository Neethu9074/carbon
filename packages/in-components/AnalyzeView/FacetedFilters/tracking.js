/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  ua2FacetedSearchFilterAddedTracker,
  ua2FacetedSearchGroupChangedTracker,
  ua2FacetedSearchGroupingRemovedTracker
} from 'in-components/tracker';

export const uaFacetedTracker = {
  groupClicked: ua2FacetedSearchGroupChangedTracker,
  suggestionClicked: ua2FacetedSearchFilterAddedTracker,
  groupRemoved: ua2FacetedSearchGroupingRemovedTracker
};
