import React from 'react';

import NumberBarItem from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarItemBehavior';
import InternalOnlyBarItem from 'in-analyze/components/filterBar/InternalOnlyBarItem';
import KeyValueBarItem from 'in-websites/analyze/AnalyzeView/WebsiteKeyValueBarItem';
import SelectBarItem from 'in-websites/analyze/AnalyzeView/WebsiteSelectBarItem';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';

export default function QuickFilterBar(props) {
  const { tagFilters, clearTagFilters, showClearFilters, onMoreClick, showInternalOnlyMarker } = props;

  return (
    <Bar
      showClearFilters={showClearFilters !== undefined ? showClearFilters : tagFilters.length > 0}
      onClearFilters={clearTagFilters}
    >
      <SelectBarItem {...props} tag="beacon.browser.name" singularLabel="browser" pluralLabel="browsers" />
      <SelectBarItem {...props} tag="beacon.os.name" singularLabel="OS" pluralLabel="OSs" />
      <SelectBarItem {...props} tag="beacon.geo.country" singularLabel="country" pluralLabel="countries" />
      <SelectBarItem {...props} tag="beacon.geo.subdivision" singularLabel="subdivision" pluralLabel="subdivisions" />
      <SelectBarItem {...props} tag="beacon.geo.city" singularLabel="city" pluralLabel="cities" />
      <KeyValueBarItem {...props} label="Meta" tag="beacon.meta" />
      <NumberBarItem {...props} tag="beacon.window.width" singularLabel="screen width" showRange />
      <NumberBarItem {...props} tag="beacon.window.height" singularLabel="screen height" showRange />
      {onMoreClick && <MoreBarItem onClick={onMoreClick} />}
      {showInternalOnlyMarker && <InternalOnlyBarItem />}
    </Bar>
  );
}
