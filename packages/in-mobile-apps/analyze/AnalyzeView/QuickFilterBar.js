/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MobileAppSelectBarItem from 'in-mobile-apps/analyze/AnalyzeView/MobileAppSelectBarItem';
import KeyValueBarItem from 'in-mobile-apps/analyze/AnalyzeView/MobileAppKeyValueBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';
import { emptyArray } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function QuickFilterBar(props) {
  const {
    implicitTagFilters = emptyArray,
    tagFilters,
    clearTagFilters,
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
        <MobileAppSelectBarItem
          {...props}
          tag="mobileBeacon.mobileApp.name"
          singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.mobileAppLabel', { count: 1 })}
          pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.mobileAppLabel', { count: 2 })}
          withoutTextTransform
        />
      )}
      {showViewSelector && (
        <MobileAppSelectBarItem
          {...props}
          tag="mobileBeacon.view.name"
          singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.viewsLabel', { count: 1 })}
          pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.viewsLabel', { count: 2 })}
          withoutTextTransform
        />
      )}
      <MobileAppSelectBarItem
        {...props}
        tag="mobileBeacon.platform"
        singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.platformLabel', { count: 1 })}
        pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.platformLabel', { count: 2 })}
      />
      <MobileAppSelectBarItem
        {...props}
        tag="mobileBeacon.os.name"
        singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.osLabel', { count: 1 })}
        pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.osLabel', { count: 2 })}
      />
      <MobileAppSelectBarItem
        {...props}
        tag="mobileBeacon.app.bundleIdentifier"
        singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.bundleLabel', { count: 1 })}
        pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.bundleLabel', { count: 2 })}
      />
      <MobileAppSelectBarItem
        {...props}
        tag="mobileBeacon.app.version"
        singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.versionLabel', { count: 1 })}
        pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.versionLabel', { count: 2 })}
      />
      <MobileAppSelectBarItem
        {...props}
        tag="mobileBeacon.geo.country"
        singularLabel={t('in-mobile-apps:analyzeView.quickFilterBar.countryLabel', { count: 1 })}
        pluralLabel={t('in-mobile-apps:analyzeView.quickFilterBar.countryLabel', { count: 2 })}
      />
      {showSubdivisionSelector && (
        <MobileAppSelectBarItem
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
    </Bar>
  );
}
