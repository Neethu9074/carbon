import React from 'react';

import NumberBarItem from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarItemBehavior';
import KeyValueBarItem from 'in-websites/analyze/AnalyzeView/WebsiteKeyValueBarItem';
import SelectBarItem from 'in-websites/analyze/AnalyzeView/WebsiteSelectBarItem';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';
import { emptyArray } from 'in-services/fixedObjects';

export default function QuickFilterBar(props) {
  const {
    implicitTagFilters = emptyArray,
    tagFilters,
    clearTagFilters,
    onMoreClick,
    showWebsiteSelector,
    showPageSelector
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
      {showPageSelector && (
        <SelectBarItem
          {...props}
          tag="beacon.page.name"
          singularLabel="Page"
          pluralLabel="Pages"
          withoutTextTransform
        />
      )}
      <SelectBarItem {...props} tag="beacon.browser.name" singularLabel="browser" pluralLabel="browsers" />
      <SelectBarItem {...props} tag="beacon.os.name" singularLabel="OS" pluralLabel="OSs" />
      <SelectBarItem {...props} tag="beacon.geo.country" singularLabel="country" pluralLabel="countries" />
      <SelectBarItem {...props} tag="beacon.geo.subdivision" singularLabel="subdivision" pluralLabel="subdivisions" />
      <KeyValueBarItem {...props} label="Meta" tag="beacon.meta" />
      <NumberBarItem {...props} tag="beacon.window.width" singularLabel="Screen Width" showRange />
      {onMoreClick && <MoreBarItem onClick={onMoreClick} />}
    </Bar>
  );
}
