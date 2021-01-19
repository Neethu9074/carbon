/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import KeyValueBarItem from 'in-mobile-apps/analyze/AnalyzeView/MobileAppKeyValueBarItem';
import SelectBarItem from 'in-mobile-apps/analyze/AnalyzeView/MobileAppSelectBarItem';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';
import { emptyArray } from 'in-services/fixedObjects';

export default function QuickFilterBar(props) {
  const {
    implicitTagFilters = emptyArray,
    tagFilters,
    clearTagFilters,
    onMoreClick,
    showMobileAppSelector,
    showViewSelector,
    showSubdivisionSelector,
    hideClearFiltersButton
  } = props;

  return (
    <Bar
      showClearFilters={hideClearFiltersButton ? false : tagFilters.length - implicitTagFilters.length > 0}
      onClearFilters={clearTagFilters}
    >
      {showMobileAppSelector && (
        <SelectBarItem
          {...props}
          tag="mobileBeacon.mobileApp.name"
          singularLabel="Mobile App"
          pluralLabel="Mobile Apps"
          withoutTextTransform
        />
      )}
      {showViewSelector && (
        <SelectBarItem
          {...props}
          tag="mobileBeacon.view.name"
          singularLabel="View"
          pluralLabel="Views"
          withoutTextTransform
        />
      )}
      <SelectBarItem {...props} tag="mobileBeacon.platform" singularLabel="Platform" pluralLabel="Platforms" />
      <SelectBarItem {...props} tag="mobileBeacon.os.name" singularLabel="OS" pluralLabel="OS" />
      <SelectBarItem {...props} tag="mobileBeacon.app.bundleIdentifier" singularLabel="Bundle" pluralLabel="Bundles" />
      <SelectBarItem {...props} tag="mobileBeacon.app.version" singularLabel="Version" pluralLabel="Versions" />
      <SelectBarItem {...props} tag="mobileBeacon.geo.country" singularLabel="country" pluralLabel="countries" />
      {showSubdivisionSelector && (
        <SelectBarItem
          {...props}
          tag="mobileBeacon.geo.subdivision"
          singularLabel="subdivision"
          pluralLabel="subdivisions"
        />
      )}
      <KeyValueBarItem {...props} label="Meta" tag="mobileBeacon.meta" />
      {onMoreClick && <MoreBarItem onClick={onMoreClick} />}
    </Bar>
  );
}
