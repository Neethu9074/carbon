import { compose, withProps } from 'recompose';
import React from 'react';

import { tagFilterManipulators, noopTagFilterTrackers } from 'in-websites/tagFiltersHoc';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import QuickFilterBar from 'in-websites/analyze/AnalyzeView/QuickFilterBar';
import { availableFilterTags } from 'in-websites/tags';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withProps(({ form, onChange }) => ({
    tagFilters: form.get('tagFilters').value,
    setTagFilters: tagFilters => onChange(['tagFilters'], field => field.setValue(tagFilters).setTouched(true)),
    filterableTags: availableFilterTags[form.get('beaconType').value] || []
  })),
  connectTo({
    timeConfig: timeConfig$
  }),
  tagFilterManipulators({ tagFiltersTrackers: noopTagFilterTrackers })
)(QuickFilterForm);

function QuickFilterForm(props) {
  return (
    <>
      <QuickFilterBar {...props} showWebsiteSelector showPageSelector withoutFiltersLabel />
      <TagFilterList {...props} />
    </>
  );
}
