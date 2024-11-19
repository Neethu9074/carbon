/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';

import QueryBuilder from 'in-custom-dashboards/CustomDashboard/FilterContext/UnifiedQueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import useUnifiedTagCatalog from 'in-custom-dashboards/hooks/useUnifiedTagCatalog';
import Sections from 'in-components/workspace/Sections';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/CustomDashboard/FilterContext/TopLevelFilterBar.mless';

interface Props {
  topLevelFilters: FormModelElement[];
  setTopLevelFilters: (filters: FormModelElement[]) => void;
}

export default function TopLevelFilterBar({ topLevelFilters, setTopLevelFilters }: Props) {
  const topLevelTagCatalog = useUnifiedTagCatalog();

  return (
    <div className={locals.topLevelFilterBar}>
      <Stack gap="xsmall">
        <Sections>
          <QueryBuilderSection
            value={topLevelFilters}
            QueryBuilder={QueryBuilder}
            tagCatalog={topLevelTagCatalog}
            onChange={setTopLevelFilters}
            useLastValidStateWhenErroneous
            withTechnicalPreview={t('in-custom-dashboards:customDashboard.filterContext.previewExplanation')}
          />
        </Sections>
      </Stack>
    </div>
  );
}
