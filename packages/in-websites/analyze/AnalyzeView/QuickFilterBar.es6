import React from 'react';

import NumberBarItem from 'in-new-components/filterBar/NumberBarItemBehavior/NumberBarItemBehavior';
import KeyValueBarItem from 'in-websites/analyze/AnalyzeView/WebsiteKeyValueBarItem';
import InternalOnlyBarItem from 'in-new-components/filterBar/InternalOnlyBarItem';
import SelectBarItem from 'in-websites/analyze/AnalyzeView/WebsiteSelectBarItem';
import MoreBarItem from 'in-new-components/filterBar/MoreBarItem';
import Bar from 'in-new-components/filterBar/Bar/Bar';
import { emptyArray } from 'in-services/fixedObjects';

export default function QuickFilterBar(props) {
  const {
    implicitTagFilters = emptyArray,
    tagFilters,
    clearTagFilters,
    onMoreClick,
    showInternalOnlyMarker,
    showWebsiteSelector
  } = props;

  return (
    <Bar showClearFilters={tagFilters.length - implicitTagFilters.length > 0} onClearFilters={clearTagFilters}>
      {showWebsiteSelector && (
        <SelectBarItem
          {...props}
          tag="beacon.website.name"
          singularLabel="Website"
          pluralLabel="Websites"
          withoutTextTransform
        />
      )}
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
