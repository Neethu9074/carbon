import React from 'react';

import SelectBarItemBehavior from 'in-websites/analyze/AnalyzeView/SelectBarItemBehavior/SelectBarItemBehavior';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';

export default function QuickFilterBar(props) {
  const { tagFilters, clearTagFilters } = props;
  return (
    <Bar showClearFilters={tagFilters.length > 0} onClearFilters={clearTagFilters}>
      <SelectBarItemBehavior {...props} tag="beacon.browser.name" singularLabel="browser" pluralLabel="browsers" />
      <SelectBarItemBehavior {...props} tag="beacon.os.name" singularLabel="OS" pluralLabel="OSs" />
      <SelectBarItemBehavior {...props} tag="beacon.geo.country" singularLabel="country" pluralLabel="countries" />
      <SelectBarItemBehavior
        {...props}
        tag="beacon.geo.subdivision"
        singularLabel="subdivision"
        pluralLabel="subdivisions"
      />
      <SelectBarItemBehavior {...props} tag="beacon.geo.city" singularLabel="city" pluralLabel="cities" />
      <BarItem showArrow>Meta</BarItem>
      <BarItem showArrow>Screen Size</BarItem>
    </Bar>
  );
}
