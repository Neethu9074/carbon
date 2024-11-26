/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Stack, Button } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-components/AnalyzeView/FacetedFilters/FacetedSearchHeader.mless';

export default function FacetedSearchHeader({ facets = {}, facetedSearchItems = [], resetFacets }) {
  const configuredFacetTags = facetedSearchItems.map(item => item.tag);
  const totalActiveCount = Object.keys(facets)
    .filter(facetItem => configuredFacetTags.indexOf(facetItem) !== -1)
    .reduce((acc, curr) => (acc += facets[curr]?.length), 0);

  return (
    <div className={locals.header}>
      <section aria-label={t('in-components:analyze.facettedFilters')}>
        <h2 className="cds--visually-hidden">{t('in-components:analyze.facettedFilters')}</h2>
        <Stack distribution={'spaceBetween'} direction={'horizontal'} align={'center'}>
          <span className={locals.facetCount}>
            {t('in-components:analyze.activeFacets', { count: totalActiveCount })}
          </span>
          {totalActiveCount > 0 && (
            <Button kind="action" href={resetFacets?.()} className={locals.clearAll}>
              {t('in-components:analyze.clearFacets')}
            </Button>
          )}
        </Stack>
      </section>
    </div>
  );
}
