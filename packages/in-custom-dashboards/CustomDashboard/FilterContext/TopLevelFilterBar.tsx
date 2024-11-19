/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import { Stack } from '@instana/components';

import QueryBuilder, { isQueryValid } from 'in-custom-dashboards/CustomDashboard/FilterContext/UnifiedQueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import useUnifiedTagCatalog from 'in-custom-dashboards/hooks/useUnifiedTagCatalog';
import Sections from 'in-components/workspace/Sections';
import { t } from 'in-i18n';
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
    <div className={locals.topLevelFilterBar}>
      <Stack gap="xsmall">
        <Sections>
          <QueryBuilderSection
            value={topLevelFilters}
            QueryBuilder={QueryBuilder}
            tagCatalog={unifiedTagCatalog}
            onChange={onTopLevelFiltersChange}
            useLastValidStateWhenErroneous
            withTechnicalPreview={t('in-custom-dashboards:customDashboard.filterContext.previewExplanation')}
            hasError={!isValid}
          />
        </Sections>
      </Stack>
    </div>
  );

  function isTopLevelFilterValid(topLevelFilters: FormModelElement[], tagCatalog: TagCatalog | undefined) {
    return topLevelFilters.length === 0 || isQueryValid(topLevelFilters, tagCatalog)?.data;
  }
}
