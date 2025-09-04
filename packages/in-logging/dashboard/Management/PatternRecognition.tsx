/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import React, { useEffect, useState } from 'react';

import { Toggle } from '@instana/components';
import { Result } from '@instana/types';

import { content, getCarbonDataRows, getTableState, urlStateDefinition } from 'in-logging/dashboard/Management/utils';
import { patterRecognitionLocalisationStrings } from 'in-logging/dashboard/Management/localisationStrings';
import { mockResult } from 'in-logging/dashboard/Management/mocks/patternRecognitionDataTableMock';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import Breadcrumbs from 'in-logging/dashboard/Management/Breadcrumbs';
import { SortState } from 'in-logging/dashboard/Management/types';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import KpiCard from 'in-components/KpiCard/KpiCard';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from 'in-logging/dashboard/Management/PatternRecognition.mless';

export default function PatternRecognition() {
  const [patternRecognitionValue] = useState(20 as number);
  const [localToggleStates, setLocalToggleStates] = useState<Record<string, boolean>>({});
  const [sortState, setSortState] = useState<SortState>({
    sortKey: 'ID',
    direction: 'NONE'
  });

  const handleToggleChange = (id: string, currentStatus: boolean) => {
    const newStatus = currentStatus ? false : true;

    setLocalToggleStates(prev => ({
      ...prev,
      [id]: newStatus
    }));

    // console.log(`Toggled ID: ${id}, new status: ${newStatus}`); Maybe REST API to dynamically change the state in the back?
  };

  const getToggleState = (id: string, originalStatus: boolean) => {
    const currentStatus = localToggleStates[id] !== undefined ? localToggleStates[id] : originalStatus;

    return (
      <div aria-label={patterRecognitionLocalisationStrings.patternState}>
        <Toggle
          labelA={patterRecognitionLocalisationStrings.disabled}
          labelB={patterRecognitionLocalisationStrings.enabled}
          checked={currentStatus}
          onToggle={() => handleToggleChange(id, currentStatus)}
        />
      </div>
    );
  };

  const [result, setResult] = useState<Result<string[]>>({
    data: undefined,
    errors: [],
    progress: {
      loading: true,
      note: 'Loading data...',
      percentage: 0
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setResult(mockResult.result as any);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const allowedPageSizes = [5, 10, 20, 30, 40, 50];

  const [{ page: rawPage, pageSize: rawPageSize }, setUrlState] = useUrlState(urlStateDefinition);

  const validatedPageSize = allowedPageSizes.includes(rawPageSize) ? rawPageSize : 5;
  const totalItems = getCarbonDataRows(result as any, getToggleState, sortState).length;
  const totalPages = Math.max(1, Math.ceil(totalItems / validatedPageSize));

  const validatedPage =
    Number.isInteger(rawPage) && rawPage >= 1 && rawPage <= totalPages ? rawPage : Math.min(1, totalPages);

  useEffect(() => {
    if (rawPage !== validatedPage || rawPageSize !== validatedPageSize) {
      setUrlState({ page: validatedPage, pageSize: validatedPageSize });
    }
  }, [rawPage, rawPageSize, validatedPage, validatedPageSize, setUrlState]);

  const allRows = getCarbonDataRows(result as any, getToggleState, sortState);
  const paginatedRows = allRows.slice((validatedPage - 1) * validatedPageSize, validatedPage * validatedPageSize);

  const handlePageChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setUrlState({ page, pageSize });
  };

  return (
    <LoggingDashboardWrapper
      title={t('in-logging:dashboard.managementPage.patternRecognition')}
      withButton={false}
      withTabs={false}
      withTimeSelection={false}
    >
      <Breadcrumbs />
      <section className={locals.content}>
        <KpiGridRow sizes={[3]}>
          <KpiCard title={patterRecognitionLocalisationStrings.currentPatterns} headingVariant="heading-2">
            <div className={locals.body}>
              <p className={locals.patterRecognitionContent}>
                <span data-testid="patternRecognitionValue" className={locals.number}>
                  {patternRecognitionValue}
                </span>
                {patterRecognitionLocalisationStrings.total}
              </p>
            </div>
          </KpiCard>
        </KpiGridRow>
      </section>
      <section className={locals.content}>
        {content[getTableState(result as any)]({
          rows: paginatedRows,
          page: validatedPage,
          pageSize: validatedPageSize,
          totalItems,
          onPageChange: handlePageChange,
          pageSizes: allowedPageSizes,
          sortState: sortState,
          setSortState: setSortState
        })}
      </section>
    </LoggingDashboardWrapper>
  );
}
