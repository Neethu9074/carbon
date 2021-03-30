/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import NumberBarItem from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarItemBehavior';
import KeyValueBarItem from 'in-websites/analyze/AnalyzeView/WebsiteKeyValueBarItem';
import SelectBarItem from 'in-websites/analyze/AnalyzeView/WebsiteSelectBarItem';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';
import { emptyArray } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function QuickFilterBar(props) {
  const {
    implicitTagFilters = emptyArray,
    tagFilters,
    clearTagFilters,
    onMoreClick,
    showWebsiteSelector,
    showPageSelector,
    showSubdivisionSelector,
    showWindowWidthSelector,
    hideClearFiltersButton,
    withoutFiltersLabel
  } = props;

  return (
    <Bar
      showClearFilters={hideClearFiltersButton ? false : tagFilters.length - implicitTagFilters.length > 0}
      onClearFilters={clearTagFilters}
      withoutLabel={withoutFiltersLabel}
    >
      {showWebsiteSelector && (
        <SelectBarItem
          {...props}
          tag="beacon.website.name"
          singularLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelWebsite', { count: 1 })}
          pluralLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelWebsite', { count: 2 })}
          withoutTextTransform
        />
      )}
      {showPageSelector && (
        <SelectBarItem
          {...props}
          tag="beacon.page.name"
          singularLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelPage', { count: 1 })}
          pluralLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelPage', { count: 2 })}
          withoutTextTransform
        />
      )}
      <SelectBarItem
        {...props}
        tag="beacon.browser.name"
        singularLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelBrowser', { count: 1 })}
        pluralLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelBrowser', { count: 2 })}
      />
      <SelectBarItem
        {...props}
        tag="beacon.os.name"
        singularLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelOS', { count: 1 })}
        pluralLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelOS', { count: 2 })}
      />
      <SelectBarItem
        {...props}
        tag="beacon.geo.country"
        singularLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelCountry', { count: 1 })}
        pluralLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelCountry', { count: 2 })}
      />
      {showSubdivisionSelector && (
        <SelectBarItem
          {...props}
          tag="beacon.geo.subdivision"
          singularLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelSubdivision', { count: 1 })}
          pluralLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelSubdivision', { count: 2 })}
        />
      )}
      <KeyValueBarItem
        {...props}
        label={t('in-websites:analyze.analyzeView.quickFilterBarLabelMeta')}
        tag="beacon.meta"
      />
      {showWindowWidthSelector && (
        <NumberBarItem
          {...props}
          tag="beacon.window.width"
          singularLabel={t('in-websites:analyze.analyzeView.quickFilterBarLabelWindowWidth')}
          showRange
        />
      )}
      {onMoreClick && <MoreBarItem onClick={onMoreClick} />}
    </Bar>
  );
}
