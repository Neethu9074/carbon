/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import QueryBuilder, { isQueryValid } from 'in-custom-dashboards/CustomDashboard/FilterContext/UnifiedQueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import useUnifiedTagCatalog from 'in-custom-dashboards/hooks/useUnifiedTagCatalog';
import { TagCatalog } from 'in-types';

import locals from 'in-custom-dashboards/CustomDashboard/FilterContext/TopLevelFilterBar.mless';

interface Props {
  topLevelFilters: FormModelElement[];
  onTopLevelFiltersChange: (filters: FormModelElement[]) => void;
}

export default function TopLevelFilterBar({ topLevelFilters, onTopLevelFiltersChange }: Props) {
  const unifiedTagCatalog = useUnifiedTagCatalog();
  const isValid = useMemo(
    () => isTopLevelFilterValid(topLevelFilters, unifiedTagCatalog),
    [topLevelFilters, unifiedTagCatalog]
  );

  return (
    <section aria-label={t('in-components:pageStructure.filterAriaLabel')} className={locals.topLevelFilterBar}>
      <Stack gap="xsmall">
        <QueryBuilderSection
          value={topLevelFilters}
          QueryBuilder={QueryBuilder}
          tagCatalog={unifiedTagCatalog}
          onChange={onTopLevelFiltersChange}
          useLastValidStateWhenErroneous
          withTechnicalPreview
          hasError={!isValid}
        />
      </Stack>
    </section>
  );

  function isTopLevelFilterValid(topLevelFilters: FormModelElement[], tagCatalog: TagCatalog | undefined) {
    return topLevelFilters.length === 0 || isQueryValid(topLevelFilters, tagCatalog)?.data;
  }
}
