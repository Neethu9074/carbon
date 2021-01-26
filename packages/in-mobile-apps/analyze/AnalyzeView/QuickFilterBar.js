/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import { t } from 'in-i18n';

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
          singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.mobileAppLabel', { count: 1 })}
          pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.mobileAppLabel', { count: 2 })}
          withoutTextTransform
        />
      )}
      {showViewSelector && (
        <SelectBarItem
          {...props}
          tag="mobileBeacon.view.name"
          singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.viewsLabel', { count: 1 })}
          pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.viewsLabel', { count: 2 })}
          withoutTextTransform
        />
      )}
      <SelectBarItem
        {...props}
        tag="mobileBeacon.platform"
        singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.platformLabel', { count: 1 })}
        pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.platformLabel', { count: 2 })}
      />
      <SelectBarItem
        {...props}
        tag="mobileBeacon.os.name"
        singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.osLabel', { count: 1 })}
        pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.osLabel', { count: 2 })}
      />
      <SelectBarItem
        {...props}
        tag="mobileBeacon.app.bundleIdentifier"
        singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.bundleLabel', { count: 1 })}
        pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.bundleLabel', { count: 2 })}
      />
      <SelectBarItem
        {...props}
        tag="mobileBeacon.app.version"
        singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.versionLabel', { count: 1 })}
        pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.versionLabel', { count: 2 })}
      />
      <SelectBarItem
        {...props}
        tag="mobileBeacon.geo.country"
        singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.countryLabel', { count: 1 })}
        pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.countryLabel', { count: 2 })}
      />
      {showSubdivisionSelector && (
        <SelectBarItem
          {...props}
          tag="mobileBeacon.geo.subdivision"
          singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.subdivisionLabel', { count: 1 })}
          pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.subdivisionLabel', { count: 2 })}
        />
      )}
      <KeyValueBarItem
        {...props}
        label={t('in-mobile-apps:analyzeView.quickFilterBar.metaLabel')}
        tag="mobileBeacon.meta"
      />
      {onMoreClick && <MoreBarItem onClick={onMoreClick} />}
    </Bar>
  );
}
