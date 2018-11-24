import React from 'react';

import SelectBarItemBehavior from 'in-websites/analyze/AnalyzeView/SelectBarItemBehavior/SelectBarItemBehavior';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';

export default function QuickFilterBar(props) {
  const { tagFilters, clearTagFilters } = props;
  return (
    <Bar showClearFilters={tagFilters.length > 0} onClearFilters={clearTagFilters}>
      <SelectBarItemBehavior {...props} tag="beacon.browser.name" barItemLabel="Browser" />
      <SelectBarItemBehavior {...props} tag="beacon.os.name" barItemLabel="OS" />
      <SelectBarItemBehavior {...props} tag="beacon.geo.country" barItemLabel="Country" />
      <SelectBarItemBehavior {...props} tag="beacon.geo.subdivision" barItemLabel="Subdivision" />
      <SelectBarItemBehavior {...props} tag="beacon.geo.city" barItemLabel="City" />
      <BarItem showArrow>Meta</BarItem>
      <BarItem showArrow>Screen Size</BarItem>
    </Bar>
  );
}
