import { compose, withProps } from 'recompose';
import React from 'react';

import TagFilterConfiguration from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/TagFilterConfiguration';
import { tagFilterManipulators, noopTagFilterTrackers } from 'in-mobile-apps/tagFiltersHoc';
import TagFilterList from 'in-analyze/components/TagFilterList/TagFilterList';
import QuickFilterBar from 'in-mobile-apps/analyze/AnalyzeView/QuickFilterBar';
import { availableFilterTags } from 'in-mobile-apps/tags';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withProps(({ form, onChange }) => {
    const beaconTypeTagFilter = form.get('tagFilters').value.find(t => t.name === 'mobileBeacon.type');
    return {
      tagFilters: form
        .get('tagFilters')
        .value // Do not show the beacon type tag filter in the list
        .filter(t => t !== beaconTypeTagFilter),
      setTagFilters: tagFilters =>
        onChange(['tagFilters'], field => field.setValue(tagFilters.concat(beaconTypeTagFilter)).setTouched(true)),
      filterableTags: availableFilterTags[form.get('beaconType').value] || []
    };
  }),
  connectTo({
    timeConfig: timeConfig$
  }),
  tagFilterManipulators({ tagFiltersTrackers: noopTagFilterTrackers })
)(QuickFilterForm);

function QuickFilterForm(props) {
  return (
    <TagFilterConfiguration
      disabled={props.disabled}
      quickFilterBar={<QuickFilterBar {...props} showMobileAppSelector showViewSelector />}
      tagFilterList={<TagFilterList {...props} />}
    />
  );
}
