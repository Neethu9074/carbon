/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, withProps } from 'recompose';
import React from 'react';

import TagFilterConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagFilterConfigurationWrapper';
import { tagFilterManipulators, noopTagFilterTrackers } from 'in-websites/tagFiltersHoc';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import { availableFilterTags } from 'in-websites/tags';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withProps(({ tagFilters, onChange, beaconType }) => {
    return {
      tagFilters,
      setTagFilters: onChange,
      filterableTags: availableFilterTags[beaconType] || []
    };
  }),
  connectTo({
    timeConfig: timeConfig$
  }),
  tagFilterManipulators({ tagFiltersTrackers: noopTagFilterTrackers })
)(QuickFilterForm);

function QuickFilterForm(props) {
  return (
    <TagFilterConfigurationWrapper
      disabled={!props.beaconType}
      isEmpty={props.tagFilters.length === 0}
      quickFilterBar={<QuickFilterBar {...props} showWebsiteSelector showPageSelector />}
      tagFilterList={<TagFilterList {...props} />}
    />
  );
}
