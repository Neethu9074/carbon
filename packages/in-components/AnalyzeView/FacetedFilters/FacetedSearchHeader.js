/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Link, Stack } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-components/AnalyzeView/FacetedFilters/FacetedSearchHeader.mless';

export default function FacetedSearchHeader({ resetFacets, totalActiveCount }) {
  return (
    <div className={locals.header}>
      <Stack distribution={'spaceBetween'} direction={'horizontal'} align={'center'}>
        <span className={locals.facetCount}>
          {t('in-components:analyze.activeFacets', { count: totalActiveCount })}
        </span>
        {totalActiveCount > 0 && (
          <span className={locals.clearAll}>
            <Link onClick={() => resetFacets()}>{t('in-components:analyze.clearFacets')}</Link>
          </span>
        )}
      </Stack>
    </div>
  );
}
