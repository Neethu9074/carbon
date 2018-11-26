import React from 'react';

import NumberBarItemBehavior from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarItemBehavior';
import SelectBarItemBehavior from 'in-websites/analyze/AnalyzeView/SelectBarItemBehavior/SelectBarItemBehavior';
import WebsiteKeyValueBarItem from 'in-websites/analyze/AnalyzeView/WebsiteKeyValueBarItem';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';

export default function QuickFilterBar(props) {
  const { tagFilters, clearTagFilters, showClearFilters, onMoreClick } = props;

  return (
    <Bar
      showClearFilters={showClearFilters !== undefined ? showClearFilters : tagFilters.length > 0}
      onClearFilters={clearTagFilters}
    >
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
      <WebsiteKeyValueBarItem {...props} label="Meta" tag="beacon.meta" />
      <NumberBarItemBehavior {...props} tag="beacon.window.width" singularLabel="screen width" showRange />
      <NumberBarItemBehavior {...props} tag="beacon.window.height" singularLabel="screen height" showRange />
      {onMoreClick && <MoreBarItem onClick={onMoreClick} />}
    </Bar>
  );
}
